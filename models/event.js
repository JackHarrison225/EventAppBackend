const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  name: String,
  city: String,
  date: Number,
  price: Number,
  description: String
})

module.exports.Event = mongoose.model('Event', eventSchema)