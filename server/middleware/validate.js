const { constants } = require('../constants');

// Username: letters, numbers, underscores, hyphens
const validateUsername = (username) => {
  if (!username) return 'Username is required';
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return 'Only letters, numbers, underscores, or hyphens allowed';
  }
  return null;
};

// ✅ Updated Email Regex to match broader domains (e.g., .com, .net, .in)
const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!/^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return 'Enter a valid email (e.g., user@domain.com)';
  }
  return null;
};

// ✅ Updated Password Regex to enforce at least 6 characters and one letter/number
const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (!/^(?=.*[a-zA-Z0-9])[a-zA-Z0-9@]{6,}$/.test(password)) {
    return 'At least 6 characters; must include letters/numbers; only @ allowed';
  }
  return null;
};

// Phone: optional, digits only, 10-15 length
const validatePhone = (phone) => {
  if (!phone) return null;
  if (!/^\d{10,15}$/.test(phone)) {
    return 'Phone must be 10-15 digits';
  }
  return null;
};

// Validate User Signup/Login Payload
const validateUser = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = {
    ...(validateUsername(username) && { username: validateUsername(username) }),
    ...(validateEmail(email) && { email: validateEmail(email) }),
    ...(validatePassword(password) && { password: validatePassword(password) }),
  };

  if (Object.keys(errors).length > 0) {
    res.status(constants.VALIDATION_ERROR);
    return next(new Error(JSON.stringify(errors)));
  }

  next();
};

// Validate Contact Form Payload
const validateContact = (req, res, next) => {
  const { name, email, phone } = req.body;
  const errors = {
    ...(validateUsername(name) && { name: validateUsername(name) }),
    ...(validateEmail(email) && { email: validateEmail(email) }),
    ...(validatePhone(phone) && { phone: validatePhone(phone) }),
  };

  if (Object.keys(errors).length > 0) {
    res.status(constants.VALIDATION_ERROR);
    return next(new Error(JSON.stringify(errors)));
  }

  next();
};

module.exports = {
  validateUser,
  validateContact,
};
