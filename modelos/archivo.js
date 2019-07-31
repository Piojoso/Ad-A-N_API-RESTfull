'use strict'

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ArchivoSchema = schema({
    name: String,
    size: Number,
    type: String,
    location: String
});

module.exports = mongoose.model('Archivo', ArchivoSchema);