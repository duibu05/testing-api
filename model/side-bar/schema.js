const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const sideBarSchema = new Schema({
  phone: { type: String, required: true },
  qq: { type: String, required: true },
  wechat: { type: String, required: true },
  addressMap: { type: String, required: true }
});


module.exports =  sideBarSchema;
