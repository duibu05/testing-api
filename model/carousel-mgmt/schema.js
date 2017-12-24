const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const carouselMgmtSchema = new Schema({
  page: { type: String, required: true },
  cat: { type: String, required: true },
  post: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  target_id: { type: String, required: true },
});


module.exports =  carouselMgmtSchema;
