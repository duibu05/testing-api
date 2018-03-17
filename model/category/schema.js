const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catSchema = new Schema({
  id: String,
  name: String
}, { _id: false });

const categorySchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  level: { type: String, required: true, default: 'first' },
  first: { type: catSchema, required: false },
  second: { type: catSchema, required: false },
  third: { type: catSchema, required: false },
  fourth: { type: catSchema, required: false },
  image: { type: String, required: true }
});


module.exports =  categorySchema;
