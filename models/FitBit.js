const {Schema, model} = require('mongoose');

const FitBitSchema = new Schema({
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  fitBitUserId: {
    type: String,
    required: true,
  },
  scopes: [{
    type: String,
    required: true
  }],
  user: {
    type: String,
    required: true,
    ref: 'user'
  }
});

const FitBit = model('FitBit', FitBitSchema);
module.exports = FitBit;