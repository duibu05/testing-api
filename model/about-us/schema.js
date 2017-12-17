const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const aboutUsSchema = new Schema({
  hotline: { type: String, required: true },
  complaintPhone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  addressMap: { type: String, required: true },
  comBrief: { type: String, required: true },
  createdAt: { type: Date, default: new Date }
});

aboutUsSchema.pre('save', function(next) {
  if(!this.createdAt) this.createdAt = new Date;
  next();
})

module.exports =  aboutUsSchema;
