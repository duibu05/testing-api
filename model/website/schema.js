const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const websiteIndexSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String }
});


module.exports =  websiteIndexSchema;
