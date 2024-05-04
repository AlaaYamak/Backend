const {Schema, model} = require('mongoose');

const GoogleFitSchema = new Schema({
  accessToken: {
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

const GoogleFit = model('GoogleFit', GoogleFitSchema);
module.exports = GoogleFit;