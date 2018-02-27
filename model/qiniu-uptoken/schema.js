const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const qiniuUpTokenSchema = new Schema({
  token: { type: String, required: true },
  meta: {
    createdAt: {
      type: Date, 
      expires: 50*60
    },
    timestamp: { type: Number, default: Date.now() }
  }
});

qiniuUpTokenSchema.pre('save', function (next) {
  if (!this.meta.createdAt) this.meta.createdAt = moment();
  if (!this.meta.timestamp) this.meta.timestamp = +moment().format('x')

  next();
})


module.exports =  qiniuUpTokenSchema;
