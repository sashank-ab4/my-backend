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

const validateProfileEditData = (req) => {
  const data = req.body;
  const allowedFields = [
    "firstName",
    "lastName",
    "age",
    "emailId",
    "about",
    "skills",
    "photoUrl",
  ];
  const isUpdatesAllowed = Object.keys(data).every((field) =>
    allowedFields.includes(field),
  );

  return isUpdatesAllowed;
  /* if(!isUpdatesAllowed){
    throw new Error('Editing this field is not allowed!')
  }
  

  res.send('Profile is updated Successfully!') */
};
/* try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "gender"];
    const isUpdatesAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdatesAllowed) {
      throw new Error("Updating this field is not allowed");
    }
    if (data?.skills.length > 5) {
      throw new Error("You cannnot add more than 5 skills!");
    }
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User is updated successfully!");
    console.log(updatedUser); */

module.exports = {
  validateSignUpData,
  validateProfileEditData,
};
