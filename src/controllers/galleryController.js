const Gallery = require('../models/Gallery');

const getGallery = async (req, res) => {
  const items = await Gallery.find({ isPublished: true }).sort({ createdAt: -1 });
  res.json(items);
};

const addGalleryItem = async (req, res) => {
  const { title, description } = req.body;
  let imageUrl = '';
  
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  const item = await Gallery.create({ title, description, imageUrl });
  res.status(201).json(item);
};

const deleteGalleryItem = async (req, res) => {
  const item = await Gallery.findById(req.params.id);
  if (item) {
    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
};

module.exports = { getGallery, addGalleryItem, deleteGalleryItem };
