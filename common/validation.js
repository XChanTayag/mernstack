const { check, validationResult } = require('express-validator');

const validateChecks = (res, req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

module.exports = validateChecks;
