const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const categorySchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  level: { type: Number, required: true, default: 1 },
  image: { type: String, required: true }
});


module.exports =  categorySchema;
