export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Invalid email format';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Minimum 8 characters';
  }
  if (!/[a-zA-Z]/.test(password)) {
    return 'At least 1 letter';
  }
  if (!/\d/.test(password)) {
    return 'At least 1 number';
  }
  // Check for common symbols/special characters
  const symbolRegex = /[^a-zA-Z0-9]/;
  if (!symbolRegex.test(password)) {
    return 'At least 1 symbol';
  }
  return null;
};
