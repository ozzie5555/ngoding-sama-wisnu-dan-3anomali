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

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return 'Nomor WhatsApp wajib diisi';
  }
  // Clean non-digits except +
  const cleaned = phone.replace(/[\s-]/g, '');
  if (!/^\+?[0-9]{9,15}$/.test(cleaned)) {
    return 'Format nomor WhatsApp tidak valid';
  }
  return null;
};

export const validateOtp = (otp) => {
  const otpStr = Array.isArray(otp) ? otp.join('') : (otp || '');
  if (!otpStr || otpStr.length !== 4 || !/^\d{4}$/.test(otpStr)) {
    return 'Masukkan 4 digit kode verifikasi.';
  }
  return null;
};

