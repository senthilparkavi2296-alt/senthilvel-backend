const mongoose = require('mongoose');

const feeItemSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g. "Tuition Fee"
  amount: { type: Number, required: true },
});

const feeStructureSchema = mongoose.Schema({
  className: { type: String, required: true },
  academicYear: { type: String, required: true, default: '2024-25' },
  feeItems: [feeItemSchema],
  totalAmount: { type: Number, default: 0 },
}, { timestamps: true });

// Auto-compute total before saving
feeStructureSchema.pre('save', function(next) {
  this.totalAmount = this.feeItems.reduce((sum, item) => sum + item.amount, 0);
  next();
});

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
