const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sideBarSchema = new Schema({
  phone: { type: String, required: true },
  qq: { type: String, required: true },
  wechatQRCodeURL: { type: String, required: true },
  addressMapURL: { type: String, required: true },
  createdAt: { type: Date, default: new Date },
  timestamp: { type: Number, default: Date.now() }
});

sideBarSchema.pre('save', function(next) {
  this.createdAt = new Date();
  this.timestamp = Date.now();
  next();
})


module.exports =  sideBarSchema;
