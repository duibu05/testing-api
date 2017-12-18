const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const carouselMgmtSchema = new Schema({
  type: { type: String, required: true },
  body: {}
});


module.exports =  carouselMgmtSchema;
