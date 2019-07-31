'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');

const createToken = (user) =>{
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix(),
    }

    return jwt.encode(payload, config.SECRET_TOKEN);
}

const decodeToken = (token) =>{
    const decode = new Promise((resolve, reject)=>{
        try{
            const payload = jwt.decode(token, config.SECRET_TOKEN);
            
            if(payload.exp <= moment().unix()){
                reject({
                    status: 401,
                    message: 'El Token ha expirado'
                });
            }

            resolve(payload.sub);

        }catch(err){
            reject({
                status: 500,
                message: 'Token Invalido'
            })
        }
    })

    return decode;
}

module.exports = {
    createToken,
    decodeToken
}