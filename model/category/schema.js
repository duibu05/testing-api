const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const categorySchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  level: { type: String, required: true, default: 'first' },
  image: { type: String, required: true }
});


module.exports =  categorySchema;
