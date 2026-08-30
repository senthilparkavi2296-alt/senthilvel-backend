const Page = require('../models/Page');

// @desc    Get all pages
// @route   GET /api/pages
// @access  Public
const getPages = async (req, res) => {
  const pages = await Page.find({ isPublished: true });
  res.json(pages);
};

// @desc    Get page by slug
// @route   GET /api/pages/:slug
// @access  Public
const getPageBySlug = async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug });
  if (page) {
    res.json(page);
  } else {
    res.status(404).json({ message: 'Page not found' });
  }
};

// @desc    Create a page
// @route   POST /api/pages
// @access  Private/Admin
const createPage = async (req, res) => {
  const { slug, title, content, metaDescription } = req.body;
  const pageExists = await Page.findOne({ slug });
  
  if (pageExists) {
    return res.status(400).json({ message: 'Page slug already exists' });
  }

  const page = await Page.create({ slug, title, content, metaDescription });
  res.status(201).json(page);
};

// @desc    Update a page
// @route   PUT /api/pages/:id
// @access  Private/Admin
const updatePage = async (req, res) => {
  const page = await Page.findById(req.params.id);
  
  if (page) {
    page.title = req.body.title || page.title;
    page.content = req.body.content || page.content;
    page.metaDescription = req.body.metaDescription || page.metaDescription;
    page.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : page.isPublished;
    
    const updatedPage = await page.save();
    res.json(updatedPage);
  } else {
    res.status(404).json({ message: 'Page not found' });
  }
};

module.exports = { getPages, getPageBySlug, createPage, updatePage };
