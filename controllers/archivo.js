'use strict'

const Archivo = require('../modelos/archivo');
const fs = require('fs');

// Responder con todos los Archivos
const getArchivos = (req, res) =>{
    Archivo.find({},(err, archivos)=>{
        if(err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`});
        if(!archivos) return res.status(404).send({message: 'No hay archivos guardados'});
        res.status(200).send(archivos)
    });
};

// Responder con INFO de un unico Archivo
const getArchivo = (req, res) =>{
    let archivoID = req.params.fileID;

    Archivo.findById(archivoID, (err, archivo)=>{
        if(err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`});
        if(!archivo) return res.status(404).send({message: 'El archivo no existe en la Base de Datos'});
        res.status(200).send(archivo);
    });
};

// Responde con una lista de todos los archivos que hagan match con el nombre enviado
const buscarArchivo = (req, res) => {
    let archivoName = req.params.fileName;
    let expresion = new RegExp(archivoName,'i');

    Archivo.find({'name':expresion},(err, archivos)=>{
        if(err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`});
        if(!archivos) return res.status(404).send({message: 'No se encontro ningun archivo en la Base de Datos con el nombre brindado'});
        res.status(200).send(archivos);
    });
}

// Responder con el archivo, para su descarga.
const descargarArchivo = (req, res) =>{
    let archivoID = req.params.fileID;

    Archivo.findById(archivoID, (err, archivo)=>{
        if(err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`});
        if(!archivo) return res.status(404).send({message: 'El archivo no existe en la Base de Datos'});
        res.status(200).download(archivo.location, (err)=>{
            if(err) return res.status(404).send({message: `Error al buscar el archivo en el directorio, puede que el archivo halla sido movido o eliminado, intentelo de nuevo mas tarde: ${err}`})
        });
    });
}

// subir un Archivo
const subirArchivo = (req, res) =>{
    if(!req.files) return res.status(500).send({message:'Archivo no Subido'});
    
    let archivo = new Archivo();
    let archivosSubidos = req.files.archivos;
    let ubicacion;
    
    archivo.name = archivosSubidos.name;
    archivo.size = archivosSubidos.size;
    archivo.type = archivosSubidos.mimeTipe;
    ubicacion = './upload/' + archivosSubidos.name;
    archivo.location = ubicacion;
    archivosSubidos.mv(ubicacion);
    let date = new Date;
    archivo.add_Date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    archivo.add_Date += " " + date.getHours() + ":" + date.getMinutes();

    archivo.save((err, archivoGuardado)=>{
        if(err) res.status(500).send({message: `Error al guardar en la DB: ${err}`});
        res.status(200).send(archivoGuardado);
    });
}

//Idea para cambiarle el nombre, es muy complicado, toma mucho tiempo, por ahora no lo hare
/*
const actualizarArchivo = (req, res)=>{
    let archivoID = req.params.fileID;
    let update = req.body;
    Archivo.findByIdAndUpdate(archivoID, update, (err, archivoActualizado) =>{
        if(err) return res.status(500).send({message:`Error al actualizar el producto: ${err}`});
        res.status(200).send({archivoActualizado});
    })
}
*/

// Borrar un Archivo
const borrarArchivo = (req, res)=>{
    let archivoID = req.params.fileID;
    Archivo.findById(archivoID, (err, archivo)=>{
        if(err) return res.status(500).send({message: `Hubo un error intentar borrar del archivo: ${err}`});
        if(!archivo) return res.status(404).send({message: 'No se encontro el archivo'});
        archivo.remove(err => {
            if(err) return res.status(500).send({message: `Hubo un error intentar borrar del archivo en la DB: ${err}`});
            fs.unlink(archivo.location, (err)=>{
                if(err) return res.status(500).send({message:`Hubo un error al intentar Borrar el archivo en el servidor`});
                res.status(200).send(archivo);
            })
        })
    })
}

module.exports = {
    getArchivos,
    getArchivo,
    buscarArchivo,
    descargarArchivo,
    subirArchivo,
    //actualizarArchivo,
    borrarArchivo
}