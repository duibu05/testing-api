const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const lessonSchema = new Schema({
  title: { type: String, required: true },
  cat: { type: String, required: true },
  brief: { type: String, required: true },
  post: { type: String, required: true },
  content: { type: String, required: true },
  kecheng: { type: String, required: true },
  keshi: { type: String, required: true },
  xingshi: { type: String, required: true },
  place: { type: String, required: true },
  startTime: { type: Date, required: true },
  cost: { type: String, required: true },
  releatedLesson: [],
  status: { type: Number, default: 1, enum: [0, 1, 2, 3]},
  createdAt: { type: Date, default: new Date },
  timestamp: { type: Number, default: Date.now() }
});

lessonSchema.pre('save', function(next) {
  if(!this.createdAt) this.createdAt = new Date;
  next();
})


module.exports =  lessonSchema;
