const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const smsSchema = new Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: new Date(), required: true, expires: 5 * 60 },
  timestamp: { type: Number, default: Date.now() }
});

smsSchema.pre('save', function(next) {
  if(!this.createdAt) this.createdAt = new Date;
  if(!this.timestamp) this.timestamp = Date.now()
  next();
})

module.exports =  smsSchema;
