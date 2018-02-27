const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const wechatUserSchema = new Schema({
  avator: { type: String, required: true },
  nickname: { type: String, required: true },
  phone: { type: String, required: true },
  openId: { type: String, required: true, unique: true },
  remark: { type: String, required: false },
  score: {
    questionSize: { type: Number, required: false, default: 0 },
    correctRate: { type: String, required: false, default: '100%' }
  },
  createdAt: { type: Date, default: new Date },
  timestamp: { type: Number, default: Date.now() }
});

wechatUserSchema.pre('save', function(next) {
  this.createdAt = moment();
  this.timestamp = +moment().format('x')
  if(this.avator == 'undefined' || this.avator == undefined) {
    next(new Error('数据不完整！！！'))
  }
  next();
})

module.exports =  wechatUserSchema;
