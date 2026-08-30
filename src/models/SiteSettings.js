const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  schoolName: { type: String, default: 'Senthilvel Vidyalaya' },
  email: { type: String, default: 'info@senthilvel.com' },
  phone: { type: String, default: '+91 9876543210' },
  address: { type: String, default: '123 School Road, Education City' },
  aboutSnippet: { type: String, default: 'Empowering minds. Building character. Shaping future leaders.' },
  
  // Custom columns/details that admin can add to the homepage
  homepageFeatures: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'BookOpen' } // Icon name to render
  }]
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
