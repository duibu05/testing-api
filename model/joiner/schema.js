const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const joinerSchema = new Schema({
  name: { type: String, required: true },
  cellphone: { type: String, required: true },
  from: { type: String, required: true },
  joinAt: { type: Date },
  joinIn: {
    sn: { type: String, required: true },
    category: { type: String, required: true },
    name: { type: String, required: true }
  }
});

joinerSchema.pre('save', function(next) {
  if (!this.joinAt) this.joinAt = new Date;
  
  next();
});

module.exports =  joinerSchema;
