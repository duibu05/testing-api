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
  if(!this.createdAt) this.createdAt = moment();
  if(!this.timestamp) this.timestamp = +moment().format('x')
  next();
})

module.exports =  newsSchema;
