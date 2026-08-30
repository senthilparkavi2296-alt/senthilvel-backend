const Menu = require('../models/Menu');

const getMenus = async (req, res) => {
  const menus = await Menu.find({ isActive: true }).sort({ order: 1 });
  res.json(menus);
};

const createMenu = async (req, res) => {
  const { title, url, order, parentId } = req.body;
  const menu = await Menu.create({ title, url, order, parentId });
  res.status(201).json(menu);
};

const updateMenu = async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  if (!menu) return res.status(404).json({ message: 'Not found' });
  Object.assign(menu, req.body);
  const updated = await menu.save();
  res.json(updated);
};

const deleteMenu = async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  if (!menu) return res.status(404).json({ message: 'Not found' });
  await menu.deleteOne();
  res.json({ message: 'Menu item removed' });
};

module.exports = { getMenus, createMenu, updateMenu, deleteMenu };
