const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
  if (!this.meta.createdAt) this.meta.createdAt = new Date;

  next();
})


module.exports =  qiniuUpTokenSchema;
