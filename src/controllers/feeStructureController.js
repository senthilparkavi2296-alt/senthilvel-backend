const FeeStructure = require('../models/FeeStructure');

const getFeeStructures = async (req, res) => {
  const structures = await FeeStructure.find().sort({ className: 1 });
  res.json(structures);
};

const getFeeStructureByClass = async (req, res) => {
  const structure = await FeeStructure.findOne({ className: req.params.className });
  if (!structure) return res.status(404).json({ message: 'No fee structure for this class' });
  res.json(structure);
};

const createFeeStructure = async (req, res) => {
  try {
    const { className, academicYear, feeItems } = req.body;
    const existing = await FeeStructure.findOne({ className, academicYear });
    if (existing) return res.status(400).json({ message: 'Fee structure already exists for this class and year' });
    const structure = await FeeStructure.create({ className, academicYear, feeItems });
    res.status(201).json(structure);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateFeeStructure = async (req, res) => {
  const structure = await FeeStructure.findById(req.params.id);
  if (!structure) return res.status(404).json({ message: 'Not found' });
  Object.assign(structure, req.body);
  await structure.save();
  res.json(structure);
};

const deleteFeeStructure = async (req, res) => {
  const structure = await FeeStructure.findById(req.params.id);
  if (!structure) return res.status(404).json({ message: 'Not found' });
  await structure.deleteOne();
  res.json({ message: 'Fee structure deleted' });
};

module.exports = { getFeeStructures, getFeeStructureByClass, createFeeStructure, updateFeeStructure, deleteFeeStructure };
