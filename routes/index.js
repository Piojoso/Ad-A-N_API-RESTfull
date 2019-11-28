'use strict'

const express = require('express');
const archivoCtrl = require('../controllers/archivo');
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const api = express.Router();

// Archivos
api.get('/archivo', auth, archivoCtrl.getArchivos); // Responder con todos los Archivos
api.get('/archivo/info/:fileID', auth, archivoCtrl.getArchivo); // Responder con INFO de un unico Archivo
api.get('/archivo/find/:fileName', auth, archivoCtrl.buscarArchivo); // Responde con una lista de todos los archivos que hagan match con el nombre enviado
api.get('/archivo/file/:fileID', archivoCtrl.descargarArchivo); // Responder con el archivo, para su descarga.
api.post('/archivo', auth, archivoCtrl.subirArchivo); // subir un Archivo
// api.put('/archivo/:fileID', archivoCtrl.actualizarArchivo); // Actualizar nombre de un Archivo (No funciona, es muy complicado, por la maldita extension )
api.delete('/archivo/:fileID', auth, archivoCtrl.borrarArchivo); // Borrar un Archivo

// User
api.post('/signup', userCtrl.signUp);
api.post('/signin', userCtrl.signIn);

// Test
api.get('/private', auth, function (req, res){
    res.status(200).send({message: 'Tienes Acceso'});
})
module.exports = api;