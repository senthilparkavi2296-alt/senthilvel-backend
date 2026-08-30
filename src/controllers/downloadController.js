const Download = require('../models/Download');

const getDownloads = async (req, res) => {
  const downloads = await Download.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(downloads);
};

const addDownload = async (req, res) => {
  const { title, category } = req.body;
  if (!req.file) return res.status(400).json({ message: 'File is required' });
  const fileUrl = `/uploads/${req.file.filename}`;
  const download = await Download.create({ title, category, fileUrl });
  res.status(201).json(download);
};

const deleteDownload = async (req, res) => {
  const download = await Download.findById(req.params.id);
  if (!download) return res.status(404).json({ message: 'Not found' });
  await download.deleteOne();
  res.json({ message: 'Download removed' });
};

module.exports = { getDownloads, addDownload, deleteDownload };
