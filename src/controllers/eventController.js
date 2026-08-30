const Event = require('../models/Event');

const getEvents = async (req, res) => {
  const events = await Event.find({ isPublished: true }).sort({ date: 1 });
  res.json(events);
};

const addEvent = async (req, res) => {
  const { title, date, description } = req.body;
  let imageUrl = '';
  
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  const event = await Event.create({ title, date, description, imageUrl });
  res.status(201).json(event);
};

const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
};

module.exports = { getEvents, addEvent, deleteEvent };
