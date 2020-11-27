// External imports
import validator from "express-validator";

const { body, validationResult } = validator;

// Checks if any errors occured during validation
const checkValidation = req => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw Error(JSON.stringify(errors));
  }
};

// Returns query, body validators
const validate = method => {
  switch (method) {
    case "fetchProblems": {
      return [];
    }
    case "submit": {
      return [body("input").notEmpty()];
    }
    default: {
      return [];
    }
  }
};

export default { checkValidation, validate };
