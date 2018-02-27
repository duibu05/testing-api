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
  questions: { type: Array },
  createdAt: { type: Date, default: new Date },
  timestamp: { type: Number, default: Date.now() }
});

paperSchema.pre('save', function(next) {
  if(!this.createdAt) this.createdAt = new Date;
  if(!this.timestamp) this.timestamp = Date.now()
  next();
})


module.exports =  paperSchema;
