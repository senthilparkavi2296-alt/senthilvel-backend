const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  admissionNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  feeType: { type: String, default: 'Full Payment' },
  academicYear: { type: String, default: '2024-25' },
  utrNumber: { type: String },
  transactionId: { type: String },
  remarks: { type: String },
  proofUrl: { type: String },
  paymentMode: { type: String, enum: ['UPI', 'Bank Transfer', 'Online', 'Cash'], default: 'UPI' },
  status: {
    type: String,
    enum: ['pending', 'under_verification', 'approved', 'rejected'],
    default: 'under_verification'
  },
  receiptNumber: { type: String, unique: true, sparse: true },
  receiptUrl: { type: String },
  approvedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
