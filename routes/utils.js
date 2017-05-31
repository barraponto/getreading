const {FormError} = require('../error');

const routeNotFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

const requiredFields = (fieldNames) => (req, res, next) => {
  const emptyFields = fieldNames.filter((fieldName) => !req.body[fieldName]);

  if (emptyFields.length) {
    next(new FormError(`${emptyFields.join(', ')} cannot be empty.`));
  } else {
    next();
  }
};

const confirmedFields = (...pairs) => (req, res, next) => {
  const unconfirmedFields = pairs.filter(
    ([field, confirmedField]) => req.body[field] !== req.body[confirmedField]);
  if (unconfirmedFields.length) {
    const message = unconfirmedFields
      .map(([field, unconfirmedField]) => `${unconfirmedField} has a different value from ${field}.`)
      .join('\n');
    next(new FormError(message));
  }
  else { next(); }
};

module.exports = {
  confirmedFields,
  requiredFields,
  routeNotFound
};
