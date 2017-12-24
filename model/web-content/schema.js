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
  createdAt: { type: Date, default: new Date }
});

webContentSchema.pre('save', function(next) {
  if(!this.createdAt) this.createdAt = new Date;
  next();
})


module.exports =  webContentSchema;