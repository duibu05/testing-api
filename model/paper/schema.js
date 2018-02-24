const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const paperSchema = new Schema({
  title: { type: String, required: true },
  firstCat: { 
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  secondCat: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  thirdCat: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  image: { type: String, required: true },
  questions: [{
    id: { type: String },
    title: { type: String },
    firstCat: { type: String },
    secondCat: { type: String },
    points: { type: Number }
  }, { _id: false }],
  createdAt: { type: Date, default: new Date }
});

paperSchema.pre('save', function(next) {
  if(!this.createdAt) this.createdAt = new Date;
  next();
})


module.exports =  paperSchema;
