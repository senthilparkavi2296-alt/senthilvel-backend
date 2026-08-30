const mongoose = require('mongoose');

const pageSchema = mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // e.g., 'home', 'about'
  title: { type: String, required: true },
  content: { type: Object, required: true }, // flexible content blocks or HTML string
  metaTitle: { type: String },
  metaDescription: { type: String },
  keywords: { type: String },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);
