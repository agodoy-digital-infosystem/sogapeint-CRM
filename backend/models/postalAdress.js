const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  streetNumber: {
    type: String,
    required: true
  },
  streetName: {
    type: String,
    required: true
  },
  addressLine2: {
    type: String
  },
  postalCode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Address', addressSchema);
