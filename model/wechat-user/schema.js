const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const wechatUserSchema = new Schema({
  avator: { type: String, required: true },
  nickname: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: new Date }
});

wechatUserSchema.pre('save', function(next) {
  if(!this.createdAt) this.createdAt = new Date;
  next();
})

module.exports =  wechatUserSchema;
