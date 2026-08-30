const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// Middleware: protect student routes (attaches studentId)
const protectStudent = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'student') return res.status(403).json({ message: 'Not authorized as student' });
      req.studentId = decoded.id;
      next();
    } catch {
      res.status(401).json({ message: 'Token failed' });
    }
  } else {
    res.status(401).json({ message: 'No token' });
  }
};

module.exports = { protectStudent };
