'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

mongoose.connect(config.db, (err, res)=>{
    if(err) console.log(`Error al conextar a la base de datos: ${err}`);
    console.log('Conexion a la DB completada');    
    app.listen(config.port, ()=>{
        console.log(`API REST corriendo en el puerto ${config.port}`);
    })
})

