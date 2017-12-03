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
  createdAt: { type: String }
});

newsSchema.pre('save', function(next) {
  if(!this.createdAt) this.createdAt = new Date;
  next();
})

module.exports =  newsSchema;
