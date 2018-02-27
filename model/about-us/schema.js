const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const aboutUsSchema = new Schema({
  hotline: { type: String, required: true },
  complaintPhone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  addressMap: { type: String, required: true },
  comBrief: { type: String, required: true },
  createdAt: { type: Date, default: new Date },
  timestamp: { type: Number, default: Date.now() }
});

aboutUsSchema.pre('save', function(next) {
  if(!this.createdAt) this.createdAt = moment();
  if(!this.timestamp) this.timestamp = +moment().format('x')
  next();
})

module.exports =  aboutUsSchema;
