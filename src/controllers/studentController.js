const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Student login: supports 3 methods
const studentLogin = async (req, res) => {
  const { admissionNumber, dateOfBirth, mobile, username, password, studentId } = req.body;
  let student = null;

  try {
    // Method 1: Admission Number + Mobile
    if (admissionNumber && mobile) {
      student = await Student.findOne({ admissionNumber, mobile });
    }
    // Method 2: Student ID + Date of Birth
    else if (studentId && dateOfBirth) {
      student = await Student.findOne({ studentId, dateOfBirth: new Date(dateOfBirth) });
    }
    // Method 3: Username + Password
    else if (username && password) {
      student = await Student.findOne({ username });
      if (student && student.password) {
        const match = await bcrypt.compare(password, student.password);
        if (!match) student = null;
      } else student = null;
    }

    if (!student) return res.status(401).json({ message: 'Invalid credentials' });
    if (!student.isActive) return res.status(403).json({ message: 'Account is inactive' });

    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, student: { _id: student._id, name: student.name, admissionNumber: student.admissionNumber, className: student.className, section: student.section, academicYear: student.academicYear, parentName: student.parentName, mobile: student.mobile } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: get all students
const getStudents = async (req, res) => {
  const students = await Student.find().sort({ className: 1, admissionNumber: 1 });
  res.json(students);
};

// Admin: create student
const createStudent = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }
    const student = await Student.create({ ...rest, ...(hashedPassword ? { password: hashedPassword } : {}) });
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: update student
const updateStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  const { password, ...rest } = req.body;
  Object.assign(student, rest);
  if (password) {
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(password, salt);
  }
  await student.save();
  res.json(student);
};

// Admin: delete student
const deleteStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  await student.deleteOne();
  res.json({ message: 'Student deleted' });
};

// Student: get own profile
const getMyProfile = async (req, res) => {
  const student = await Student.findById(req.studentId).select('-password');
  if (!student) return res.status(404).json({ message: 'Not found' });
  res.json(student);
};

module.exports = { studentLogin, getStudents, createStudent, updateStudent, deleteStudent, getMyProfile };
