'use strict'

const Archivo = require('../modelos/archivo');
const fs = require('fs');

const getArchivos = (req, res) =>{
    Archivo.find({},(err, archivos)=>{
        if(err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`});
        if(!archivos) return res.status(404).send({message: 'No hay archivos guardados'});
        res.status(200).send(archivos)
    });
};

const getArchivo = (req, res) =>{
    let archivoID = req.params.fileID;

    Archivo.findById(archivoID, (err, archivo)=>{
        if(err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`});
        if(!archivo) return res.status(404).send({message: 'El archivo no existe en la Base de Datos'});
        res.status(200).download(archivo.location, (err)=>{
            if(err) return res.status(404).send({message: `Error al buscar el archivo en el directorio, puede que el archivo halla sido movido o eliminado, intentelo de nuevo mas tarde: ${err}`})
        });
    });
};

const subirArchivo = (req, res) =>{
    if(!req.files) res.status(false).send({message:'Archivo no Subido'});
    
    let archivo = new Archivo();
    let archivosSubidos = req.files.archivos;
    let ubicacion;
    
    archivo.name = archivosSubidos.name;
    archivo.size = archivosSubidos.size;
    archivo.type = archivosSubidos.mimeTipe;
    ubicacion = './upload/' + archivosSubidos.name;
    archivo.location = ubicacion;
    archivosSubidos.mv(ubicacion);

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
    subirArchivo,
    //actualizarArchivo,
    borrarArchivo
}