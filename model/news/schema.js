const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const newsSchema = new Schema({
  title: { type: String, required: true },
  keywords: [{
    value: {type: String},
    key: {type: Number}
  }],
  content: { type: String },
  attachments: { type: Object },
  createdAt: { type: Date, default: new Date },
  timestamp: { type: Number, default: Date.now() }
});

newsSchema.pre('save', function(next) {
  if(!this.createdAt) this.createdAt = new Date;
  if(!this.timestamp) this.timestamp = Date.now()
  console.log(this.createdAt, this.timestamp, moment().format(), moment().format('X'), moment().format('x'))
  next();
})

module.exports =  newsSchema;
