'use strict'

const Archivo = require('../modelos/archivo');
const fs = require('fs');

// Responder con todos los Archivos
const getArchivos = (req, res) =>{
    let user = req.user;

    Archivo.find({ user: user },(err, archivos)=>{
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
        if(archivo.user != req.user) return res.status(403).send({message: 'No cuenta con los permisos para ver la info de este archivo'});
        res.status(200).send(archivo);
    });
};

// Responde con una lista de todos los archivos que hagan match con el nombre enviado
const buscarArchivo = (req, res) => {
    let archivoName = req.params.fileName;
    let expresion = new RegExp(archivoName,'i');

    Archivo.find({'name':expresion, user: req.user },(err, archivos)=>{
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
    let ubicacion = './upload/' + req.user + '/' + archivosSubidos.name;

    archivo.name = archivosSubidos.name;
    archivo.size = archivosSubidos.size;
    archivo.type = archivosSubidos.mimeTipe;
    archivo.location = ubicacion;
    archivosSubidos.mv(ubicacion);
    let date = new Date;
    archivo.add_Date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    archivo.add_Date += " " + date.getHours() + ":" + date.getMinutes();
    archivo.user = req.user;

    archivo.save((err, archivoGuardado)=>{
        if(err) res.status(500).send({message: `Error al guardar en la DB: ${err}`});
        res.status(200).send(archivoGuardado);
    });
}

// Actualizar archivo, de uno viejo a uno mas nuevo.

const actualizarArchivo = (req, res)=>{
    let archivoID = req.params.fileID;
    if(!req.files) return res.status(500).send({message:'Archivo no Subido'});

    /** FUNCIONAMIENTO:
     * Primero deberia buscar que el archivo a cambiar exista --- HECHO
     * Ver que el usuario tenga permiso sobre ese archivo --- HECHO
     * Obtener toda la nueva info del archivo reemplazador --- HECHO
     * Eliminar archivo anterior --- HECHO
     * Modifico el objeto anterior para luego updatear la db --- HECHO
     * Colocar archivo nuevo --- HECHO
     * Updatear la DB. --- HECHO
     */

    Archivo.findById(archivoID, (err, archivoViejo) => {
        // Primero deberia buscar que el archivo a cambiar exista
        if(err) return res.status(404).send({message: `Archivo no encontrado: ${err}`});
        // Ver que el usuario tenga permiso sobre ese archivo
        if(archivoViejo.user != req.user) return res.status(403).send({message: 'No cuenta con los permisos para ver la info de este archivo'});

        // Obtener toda la nueva info del archivo reemplazador
        let archivoReemplazador = req.files.archivos;

        // Eliminar archivo anterior
        fs.unlink(archivoViejo.location, (err)=>{
            if(err) return res.status(500).send({message:`Hubo un error al intentar Borrar el archivo en el servidor`});

            // Modifico el objeto anterior para luego updatear la db
            let ubicacion = './upload/' + req.user + '/' + archivosReemplazador.name;
            let date = new Date.getDate() + "/" + (Date.getMonth() + 1) + "/" + Date.getFullYear() + " " + Date.getHours() + ":" + Date.getMinutes();
            
            archivoViejo.name = archivoReemplazador.name;
            archivoViejo.size = archivoReemplazador.size;
            archivoViejo.type = archivoReemplazador.mimeTipe;
            archivoViejo.location = ubicacion;
            archivoViejo.add_Date = date;

            // Colocar archivo nuevo
            archivosReemplazador.mv(ubicacion);

            // Updatear la DB.
            Archivo.findByIdAndUpdate(archivoID, archivoViejo, (err, archivoActualizado) =>{
                if(err) return res.status(500).send({message:`Error al actualizar el producto: ${err}`});
                res.status(200).send({archivoActualizado});
            });
        });
    });
}

// Borrar un Archivo
const borrarArchivo = (req, res)=>{
    let archivoID = req.params.fileID;
    Archivo.findById(archivoID, (err, archivo)=>{
        if(err) return res.status(500).send({message: `Hubo un error intentar borrar del archivo: ${err}`});
        if(!archivo) return res.status(404).send({message: 'No se encontro el archivo'});
        if(archivo.user = req.user){
            archivo.remove(err => {
                if(err) return res.status(500).send({message: `Hubo un error intentar borrar del archivo en la DB: ${err}`});
                fs.unlink(archivo.location, (err)=>{
                    if(err) return res.status(500).send({message:`Hubo un error al intentar Borrar el archivo en el servidor`});
                    res.status(200).send(archivo);
                })
            })
        }
        else{
            return res.status(403).send({message: 'No tiene permisos para eliminar este archivo'});
        }
    })
}

module.exports = {
    getArchivos,
    getArchivo,
    buscarArchivo,
    descargarArchivo,
    subirArchivo,
    actualizarArchivo,
    borrarArchivo
}