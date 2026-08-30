const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
