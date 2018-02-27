const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const webContentSchema = new Schema({
  title: { type: String, required: true },
  title: { type: String, required: true },
  keywords: [],
  cat: { type: String, required: true },
  subCat: { type: String, required: true },
  attachments: {},
  content: { type: String, required: true },
  createdAt: { type: Date, default: new Date },
  timestamp: { type: Number, default: Date.now() }
});

webContentSchema.pre('save', function(next) {
  this.createdAt = new Date();
  this.timestamp = Date.now();
  next();
})


module.exports =  webContentSchema;
