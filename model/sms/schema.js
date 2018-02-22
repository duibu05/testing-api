const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const smsSchema = new Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: new Date(), required: true, expires: 5 * 60 }
});


module.exports =  smsSchema;