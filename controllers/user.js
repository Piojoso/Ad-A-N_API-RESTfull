'use strct'

const mongoose = require('mongoose');
const User = require('../modelos/user');
const service = require('../services');
const fs = require('fs');

// Funcion para la creacion de un nuevo usuario cuando este se registra.
const signUp = (req, res) =>{
    const user = new User();

    user.email = req.body.email;
    user.userName =  req.body.userName;
    user.password = req.body.password;

    user.save(err =>{
        if(err) return res.status(500).send({message: `Error al crear el usuario: ${err}`});
        fs.mkdir('upload/' + user._id, err => {
            if(err) return res.status(500).send({message: `Error al intentar crear la carpeta del usuario ${err}`});
            
            return res.status(201).send({token: service.createToken(user)});
        });
    });
}

// Funcion para el logueo del usuario cuando este ya existe.
const signIn = (req, res) =>{
    User.findOne({ email: req.body.email }).select('password').exec((err, user) =>{
        if(err) return res.status(500).send({message: `Hubo un error al buscar el usuario: ${err}`});
        if(!user) return res.status(404).send({message: 'No existe el usuario'});
        if(req.body.password === user.password){
            res.status(200).send({token: service.createToken(user)});
        }
        else return res.status(401).send({message: 'Contraseña Erronea'});
    });
}

module.exports = {
    signUp,
    signIn
}