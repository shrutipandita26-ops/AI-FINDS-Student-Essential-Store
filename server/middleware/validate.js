export function validateRegister(req, res, next) {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string') {
    errors.push('Email is required.');
  }
  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

export function validateProduct(req, res, next) {
  const { title, category, price, shopName } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Product title is required.');
  }
  if (!category || typeof category !== 'string') {
    errors.push('Valid category is required.');
  }
  if (price === undefined || typeof price !== 'number' || price < 0) {
    errors.push('Price must be a non-negative number.');
  }
  if (!shopName || typeof shopName !== 'string') {
    errors.push('Shop name is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

export function validateOrder(req, res, next) {
  const { studentName, rollNumber, phone, items, total } = req.body;
  const errors = [];

  if (!studentName || typeof studentName !== 'string' || studentName.trim().length === 0) {
    errors.push('Student name is required.');
  }
  if (!rollNumber || typeof rollNumber !== 'string' || rollNumber.trim().length === 0) {
    errors.push('Student roll or registration number is required.');
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
    errors.push('Valid phone number is required.');
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Order must contain at least one product.');
  }
  if (total === undefined || typeof total !== 'number' || total < 0) {
    errors.push('Total amount must be a valid number.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}
