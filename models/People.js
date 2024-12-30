const mongoose = require('mongoose');

// People Schema
const PeopleSchema = new mongoose.Schema({
  telegramId: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String },
  photoUrl: { type: String },
  balance: { type: Number, default: 0 }, // Initial balance field
});

module.exports = mongoose.model('People', PeopleSchema);