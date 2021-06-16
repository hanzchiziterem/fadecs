module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-z]([-.\w]*[0-9a-zA-z])*@([0-9a-zA-z][-\w]*[0-9a-zA-z]\.)*[a-zA-z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid Address";
    }
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = `Passwords must Match`;
  }
  return {
    errors,
    // if lenght is < 1 then there is no error
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }
  return {
    errors,
    // if lenght is < 1 then there is no error
    valid: Object.keys(errors).length < 1,
  };
};
