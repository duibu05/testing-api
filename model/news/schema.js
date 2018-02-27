const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  this.createdAt = new Date();
  this.timestamp = Date.now();
  next();
})

module.exports =  newsSchema;
