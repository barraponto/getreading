const requiredFields = (fieldNames) => (req, res, next) => {
  const emptyFields = fieldNames.filter((fieldName) => !req.body[fieldName]);

  if (emptyFields.length) {
    res.status(400).json({error: `${emptyFields.join(', ')} cannot be empty`});
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
    res.status(400).json({error: message});
  }
  else { next(); }
};

module.exports = {
  confirmedFields,
  requiredFields
};
