'use strict'

const service = require('../services');

const isAuth = (req, res, next)=>{
    if(!req.headers.authorization) return res.status(403).send({message:'No tienes autorizacion'});

    const token = req.headers.authorization.split(" ")[1];
    
    service.decodeToken(token)
        .then((responce)=>{
            req.user = responce;
            next();
        })
        .catch((responce) =>{
            res.status(responce.status).send(responce.message);
        })
}

module.exports = isAuth;