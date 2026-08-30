const PDFDocument = require('pdfkit');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const FeeStructure = require('../models/FeeStructure');
const PaymentSettings = require('../models/PaymentSettings');
const path = require('path');
const fs = require('fs');

// Helper: generate receipt number
const generateReceiptNumber = () => `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Student: get fee summary
const getFeeSummary = async (req, res) => {
  try {
    const student = await Student.findById(req.studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const feeStructure = await FeeStructure.findOne({ className: student.className, academicYear: student.academicYear });
    const payments = await Payment.find({ student: student._id, status: 'approved' });
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalFee = feeStructure ? feeStructure.totalAmount : 0;

    res.json({
      student,
      feeItems: feeStructure ? feeStructure.feeItems : [],
      totalFee,
      totalPaid,
      balance: Math.max(0, totalFee - totalPaid),
      payments
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Student: submit payment proof
const submitPayment = async (req, res) => {
  try {
    const { amount, feeType, utrNumber, transactionId, remarks, paymentMode } = req.body;
    const student = await Student.findById(req.studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const proofUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const payment = await Payment.create({
      student: student._id,
      admissionNumber: student.admissionNumber,
      amount: Number(amount),
      feeType,
      utrNumber,
      transactionId,
      remarks,
      paymentMode,
      proofUrl,
      academicYear: student.academicYear
    });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Student: get own payment history
const getMyPayments = async (req, res) => {
  const payments = await Payment.find({ student: req.studentId }).sort({ createdAt: -1 });
  res.json(payments);
};

// Admin: get all pending payments
const getPendingPayments = async (req, res) => {
  const payments = await Payment.find({ status: 'under_verification' })
    .populate('student', 'name admissionNumber className section')
    .sort({ createdAt: -1 });
  res.json(payments);
};

// Admin: get all payments
const getAllPayments = async (req, res) => {
  const payments = await Payment.find()
    .populate('student', 'name admissionNumber className section')
    .sort({ createdAt: -1 });
  res.json(payments);
};

// Admin: approve payment + generate PDF receipt
const approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('student');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const receiptNumber = generateReceiptNumber();
    payment.status = 'approved';
    payment.approvedAt = new Date();
    payment.approvedBy = req.user._id;
    payment.receiptNumber = receiptNumber;

    // Generate PDF receipt
    const receiptDir = path.join(__dirname, '../../uploads/receipts');
    if (!fs.existsSync(receiptDir)) fs.mkdirSync(receiptDir, { recursive: true });
    const receiptPath = path.join(receiptDir, `${receiptNumber}.pdf`);

    await generateReceiptPDF(payment, receiptPath);
    payment.receiptUrl = `/uploads/receipts/${receiptNumber}.pdf`;

    await payment.save();
    res.json({ message: 'Payment approved', payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: reject payment
const rejectPayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  payment.status = 'rejected';
  payment.rejectionReason = req.body.reason || 'Payment proof invalid';
  await payment.save();
  res.json({ message: 'Payment rejected', payment });
};

// PDF Generator
const generateReceiptPDF = (payment, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.rect(0, 0, doc.page.width, 120).fill('#1e3a8a');
    doc.fill('white').fontSize(22).font('Helvetica-Bold').text('Senthilvel Vidyalaya', 50, 35, { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('Official Fee Receipt', 50, 65, { align: 'center' });
    doc.fill('black');

    // Receipt Number
    doc.moveDown(3);
    const col1 = 50, col2 = 300;
    doc.fontSize(10).font('Helvetica-Bold').text(`Receipt No: ${payment.receiptNumber}`, col1);
    doc.text(`Date: ${new Date(payment.approvedAt).toLocaleDateString('en-IN')}`, col2, doc.y - doc.currentLineHeight());

    doc.moveDown().moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#e5e7eb').stroke();
    doc.moveDown();

    // Student Details
    const s = payment.student;
    doc.font('Helvetica-Bold').fontSize(11).text('Student Information', col1);
    doc.moveDown(0.5);
    const details = [
      ['Student Name', s.name], ['Admission No', s.admissionNumber],
      ['Class & Section', `${s.className} ${s.section || ''}`], ['Academic Year', s.academicYear || '2024-25'],
    ];
    details.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').fontSize(9).text(`${label}:`, col1, doc.y, { continued: true }).font('Helvetica').text(`  ${value}`);
    });

    doc.moveDown().moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#e5e7eb').stroke().moveDown();

    // Fee Details
    doc.font('Helvetica-Bold').fontSize(11).text('Payment Details', col1);
    doc.moveDown(0.5);
    const feeDetails = [
      ['Fee Type', payment.feeType], ['Amount Paid', `₹${payment.amount.toLocaleString('en-IN')}`],
      ['Payment Mode', payment.paymentMode], ['Transaction ID', payment.transactionId || payment.utrNumber || 'N/A'],
    ];
    feeDetails.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').fontSize(9).text(`${label}:`, col1, doc.y, { continued: true }).font('Helvetica').text(`  ${value}`);
    });

    // Total Box
    doc.moveDown(2);
    doc.rect(350, doc.y, 200, 50).fill('#1e3a8a');
    doc.fill('white').fontSize(12).font('Helvetica-Bold')
      .text('AMOUNT PAID', 360, doc.y - 45)
      .fontSize(18).text(`₹${payment.amount.toLocaleString('en-IN')}`, 360, doc.y - 20);
    doc.fill('black');

    // Footer
    doc.moveDown(4);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#e5e7eb').stroke().moveDown();
    doc.fontSize(8).font('Helvetica').fillColor('#6b7280')
      .text('This is a computer-generated receipt and does not require a physical signature.', 50, doc.y, { align: 'center' })
      .text('For queries, contact: info@senthilvelvidyalaya.edu | +1 (234) 567-8900', { align: 'center' });

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
};

// Admin: get/update payment settings
const getPaymentSettings = async (req, res) => {
  let settings = await PaymentSettings.findOne();
  if (!settings) settings = await PaymentSettings.create({});
  res.json(settings);
};

const updatePaymentSettings = async (req, res) => {
  let settings = await PaymentSettings.findOne();
  if (!settings) settings = new PaymentSettings();
  Object.assign(settings, req.body);
  if (req.file) settings.qrCodeUrl = `/uploads/${req.file.filename}`;
  await settings.save();
  res.json(settings);
};

module.exports = { getFeeSummary, submitPayment, getMyPayments, getPendingPayments, getAllPayments, approvePayment, rejectPayment, getPaymentSettings, updatePaymentSettings };
