'use strict'

const express = require('express');
const archivoCtrl = require('../controllers/archivo');
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const api = express.Router();

// Archivos
api.get('/archivo', archivoCtrl.getArchivos); // Responder con todos los Archivos
api.get('/archivo/:fileID', archivoCtrl.getArchivo); // Responder con un unico Archivo
api.post('/archivo',/* multipartMiddelware,*/ archivoCtrl.subirArchivo); // subir un Archivo
// api.put('/archivo/:fileID', archivoCtrl.actualizarArchivo); // Actualizar nombre de un Archivo (No funciona, es muy complicado, por la maldita extension )
api.delete('/archivo/:fileID', archivoCtrl.borrarArchivo); // Borrar un Archivo

// User
api.post('/signup', userCtrl.signUp);
api.post('/signin', userCtrl.signIn);

// Test
api.get('/private', auth, function (req, res){
    res.status(200).send({message: 'Tienes Acceso'});
})
module.exports = api;