const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const questionSchema = new Schema({
  title: { type: String, required: true },
  firstCat: { 
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  secondCat: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  body: { type: String, required: true },
  answers: [{
    options: { type: String, required: true },
    content: { type: String, required: true },
  }],
  rightAnswer: { type: String, required: true },
  analysis: { type: String, required: true },
  createdAt: { type: Date, default: new Date }
});

questionSchema.pre('save', function(next) {
  if(!this.createdAt) this.createdAt = new Date;
  next();
})


module.exports =  questionSchema;