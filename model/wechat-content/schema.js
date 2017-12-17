const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const wechatContentSchema = new Schema({
  title: { type: String, required: [true, '标题必填！']},
  cat: { type: String },
  catName: { type: String },
  keywords: [{
    value: { type: String },
  }],
  post: { type: String },
  content: { type: String, required: [true, '内容必填！']},
  createdAt: { type: Date, default: new Date }
});

wechatContentSchema.pre('save', function(next) {
  if(!this.createdAt) this.createdAt = new Date;
  next();
})

wechatContentSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else if(error.name === 'ValidationError') {
    for(let key in error.errors) {
      next(new Error(error.errors[key].message));
    }
  }
});

module.exports =  wechatContentSchema;
