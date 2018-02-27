const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const smsSchema = new Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: new Date(), required: true, expires: 5 * 60 },
  timestamp: { type: Number, default: Date.now() }
});

smsSchema.pre('save', function(next) {
  if(!this.createdAt) this.createdAt = moment();
  if(!this.timestamp) this.timestamp = +moment().format('x')
  next();
})

module.exports =  smsSchema;
