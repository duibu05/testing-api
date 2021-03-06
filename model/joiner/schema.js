const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const joinerSchema = new Schema({
  name: { type: String, required: true },
  cellphone: { type: String, required: true },
  openId: { type: String, required: false },
  from: { type: String, required: true },
  joinAt: { type: Date },
  timestamp: { type: Number },
  joinIn: {
    sn: { type: String, required: true },
    category: { type: String, required: true },
    name: { type: String, required: true },
    post: { type: String, require: true }
  }
});

joinerSchema.pre('save', function(next) {
  this.joinAt = new Date;
  this.timestamp = Date.now();
  
  next();
});

module.exports =  joinerSchema;
