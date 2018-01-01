const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const historySchema = new Schema({
  openId: { type: String, required: true },
  question: {
    
  },
  qid: { type: String, required: true },
  status: { type: String },
});


module.exports =  historySchema;
