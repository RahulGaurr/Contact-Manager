// Generic cleaner factory
const createCleaner = (regex) => (value) => value.replace(regex, '');

// Generic validator factory
const createValidator = (regex, emptyMsg, invalidMsg) => (value) => {
  if (!value) return emptyMsg;
  return regex.test(value) ? '' : invalidMsg;
};

// Utility: Check for functional keys (used in keydown)
export const isFunctionalKey = (key) =>
  key.length > 1 || ['Backspace', 'Delete', 'Tab', 'Enter'].includes(key);

// Cleaners
export const cleanUsernameInput = createCleaner(/[^a-zA-Z0-9_-]/g);
export const cleanEmailInput = createCleaner(/[^a-zA-Z0-9._@]/g);
export const cleanPasswordInput = createCleaner(/[^a-zA-Z0-9@]/g);
export const cleanPhoneInput = createCleaner(/[^0-9]/g);

// Validators
export const validateUsername = createValidator(
  /^[a-zA-Z0-9_-]+$/,
  'Username is required',
  'Only letters, numbers, underscores, or hyphens allowed'
);

export const validateEmail = createValidator(
  /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  'Email is required',
  'Enter a valid email (e.g., user@domain.com)'
);

export const validatePassword = createValidator(
  /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9@]{6,}$/,
  'Password is required',
  'At least 6 characters; must include letters/numbers; only @ allowed'
);

export const validatePhone = (phone) => {
  if (!phone) return ''; // Optional
  return /^\d{10,15}$/.test(phone) ? '' : 'Phone must be 10-15 digits';
};