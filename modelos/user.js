'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    userName: String,
    password: { type:String, select:false},
});
    
module.exports = mongoose.model('User', UserSchema);