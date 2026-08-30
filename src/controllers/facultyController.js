const Faculty = require('../models/Faculty');

const getFaculty = async (req, res) => {
  const faculty = await Faculty.find({ isActive: true }).sort({ department: 1 });
  res.json(faculty);
};

const addFaculty = async (req, res) => {
  const { name, designation, qualification, experience, department, email, phone } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
  const member = await Faculty.create({ name, designation, qualification, experience, department, email, phone, imageUrl });
  res.status(201).json(member);
};

const updateFaculty = async (req, res) => {
  const member = await Faculty.findById(req.params.id);
  if (!member) return res.status(404).json({ message: 'Not found' });
  Object.assign(member, req.body);
  if (req.file) member.imageUrl = `/uploads/${req.file.filename}`;
  const updated = await member.save();
  res.json(updated);
};

const deleteFaculty = async (req, res) => {
  const member = await Faculty.findById(req.params.id);
  if (!member) return res.status(404).json({ message: 'Not found' });
  await member.deleteOne();
  res.json({ message: 'Faculty member removed' });
};

module.exports = { getFaculty, addFaculty, updateFaculty, deleteFaculty };
