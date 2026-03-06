const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid, must contain more than 4 letters!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("check the email format");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please choose a strong password!");
  }
};

module.exports = {
  validateSignUpData,
};
