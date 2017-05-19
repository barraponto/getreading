const requiredFields = (fieldNames) => (req, res, next) => {
  const emptyFields = fieldNames.filter((fieldName) => !req.body[fieldName]);

  if (emptyFields.length) {
    res.status(400).json({error: `${emptyFields.join(', ')} cannot be empty`});
  } else {
    next();
  }
};


module.exports = {
  requiredFields
};
