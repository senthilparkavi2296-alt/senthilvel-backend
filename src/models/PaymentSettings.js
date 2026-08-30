const mongoose = require('mongoose');

const paymentSettingsSchema = mongoose.Schema({
  schoolName: { type: String, default: 'Senthilvel Vidyalaya' },
  // GPay / UPI
  upiEnabled: { type: Boolean, default: true },
  upiId: { type: String, default: 'senthilvelvidyalaya@okaxis' },
  qrCodeUrl: { type: String },
  // Bank Transfer
  bankEnabled: { type: Boolean, default: true },
  accountHolderName: { type: String, default: 'Senthilvel Vidyalaya' },
  bankName: { type: String },
  accountNumber: { type: String },
  ifscCode: { type: String },
  branchName: { type: String },
  // Other
  lateFeePerDay: { type: Number, default: 0 },
  dueDayOfMonth: { type: Number, default: 10 },
}, { timestamps: true });

module.exports = mongoose.model('PaymentSettings', paymentSettingsSchema);
