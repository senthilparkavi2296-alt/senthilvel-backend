const SiteSettings = require('../models/SiteSettings');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      // Create default if none exists
      settings = await SiteSettings.create({
        homepageFeatures: [
          { title: 'Quality Education', description: 'Providing world-class education with modern facilities.', icon: 'BookOpen' },
          { title: 'Expert Faculty', description: 'Learn from highly qualified and experienced teachers.', icon: 'Users' },
          { title: 'Sports & Arts', description: 'Holistic development through extracurricular activities.', icon: 'Trophy' }
        ]
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private (Admin)
exports.updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    
    if (settings) {
      settings.schoolName = req.body.schoolName || settings.schoolName;
      settings.email = req.body.email || settings.email;
      settings.phone = req.body.phone || settings.phone;
      settings.address = req.body.address || settings.address;
      settings.aboutSnippet = req.body.aboutSnippet || settings.aboutSnippet;
      
      if (req.body.homepageFeatures) {
        settings.homepageFeatures = req.body.homepageFeatures;
      }
      
      await settings.save();
    } else {
      settings = await SiteSettings.create(req.body);
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
