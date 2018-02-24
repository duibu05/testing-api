const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const historySchema = new Schema({
  openId: { type: String, required: true, unique: true },
  questionSize: {
    type: Number,
    default: 0
  },
  rightQuestionSize: { type: Number, default: 0 },
  correctRate: { type: String, required: true, default: '0%' }
});


module.exports =  historySchema;
