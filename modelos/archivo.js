'use strict'

const mongoose = require('mongoose');
const schema = mongoose.Schema;
const users = require('./user');

const ArchivoSchema = schema({
    name: String,
    size: Number,
    type: String,
    location: String,
    add_Date: String,
    user: { type: schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Archivo', ArchivoSchema);