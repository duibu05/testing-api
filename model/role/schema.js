const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const roleSchema = new Schema({
  name: { type: String, required: [true, '角色名称必填！'], unique: true },
  body: { type: Object, required: true },
  createdAt: { type: Date, default: new Date },
  timestamp: { type: Number, default: Date.now() }
});

roleSchema.pre('save', function(next) {
  if(!this.createdAt) this.createdAt = moment();
  if(!this.timestamp) this.timestamp = +moment().format('x')
  next();
})

roleSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('存在同名数据！'));
  } else if(error.name === 'ValidationError') {
    for(let key in error.errors) {
      next(new Error(error.errors[key].message));
    }
  }
});

module.exports =  roleSchema;
