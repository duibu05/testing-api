const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const wrongQuestionSchema = new Schema({
  paperId: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  score: { type: Number, required: false },
  progress: { type: Number, required: true },
  questionSize: { type: Number, required: true },
  questionsHistory: { type: Array, required: true },
  status: { type: Number, required: true, default: 1 }, // 1-undone 2-done
  openId: { type: String, required: true },
  createdAt: { type: Date, default: new Date },
  timestamp: { type: Number, default: Date.now() }
});

wrongQuestionSchema.pre('save', function(next) {
  this.createdAt = new Date();
  this.timestamp = Date.now();
  next();
})


module.exports =  wrongQuestionSchema;
