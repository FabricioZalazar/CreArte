import album from "../models/albumModel.js";
import imagenModel from "../models/imagenModel.js";
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';


const mostrarAlbumes = async (req, res) => {
    try {
        const idUsuario = req.params.id;
        const datosAlbum = await album.listarPorUsuario(idUsuario);
        if (!datosAlbum) {
            return res.status(404).send('Usuario sin Albums');
        }
        res.render('usuario', { album: datosAlbum });
    } catch (error) {
        console.error('Error al buscar el álbum:', error);
        res.status(500).send('Error interno del servidor');
    }
}

const editarAlbum = async (req, res) => {
  try {
    const { titulo, modo, descripcion, portada } = req.body;
    
    // Convertimos el checkbox destacado a booleano
    const destacado = req.body.destacado === 'on';

    const datos = { titulo, modo, descripcion, destacado, portada };

    const result = await album.editar(req.body.idAlbum, datos);

    if (result && result > 0) {
      res.redirect('/perfil');
    } else {
      res.status(405).send('No se pudo editar el álbum');
    }
  } catch (error) {
    console.error('Error al editar el álbum:', error);
    res.status(500).send('Error interno del servidor');
  }
};


const crearAlbum = async (req, res) => {
    try {
        const { titulo, descripcion, modo, destacado } = req.body;
        const idUsuario = req.session.usuario.idUsuario;
        const portada = null;

        const nuevoAlbum = await album.crear({
            idUsuario,
            titulo,
            descripcion,
            modo,
            destacado: destacado ? 1 : 0,
            portada
        });

        res.redirect('/perfil');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear álbum' + error);
    }
};

const crearImagen = async (req, res) => {
  console.log('Entró al controlador de imágenes');

  try {
    let { idAlbum, portada, caption } = req.body;

    if (caption.trim() === '') {
    caption = null;
}

    if (!req.files || req.files.length === 0) {
      return res.status(400).send('No se subieron imágenes');
    }

    const imagenesProcesadas = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const archivoOriginal = file.path;
      const nombreFinal = Date.now() + '-' + i + '.jpg';
      const rutaFinal = path.join('public/img', nombreFinal);

      // Redimensionar y guardar la imagen optimizada
      await sharp(archivoOriginal)
        .resize(800)
        .jpeg({ quality: 70 })
        .toFile(rutaFinal);

      // Eliminar el archivo temporal
      fs.unlinkSync(archivoOriginal);

      // Guardar en base de datos
      await imagenModel.crear({
        idAlbum: idAlbum,
        fecha: new Date(),
        caption: caption || '',
        rutaImagen: '/img/' + nombreFinal,
        status: 1,
        esPortada: parseInt(portada) === i ? 1 : 0
      });

      imagenesProcesadas.push(nombreFinal);
    }

    console.log('Imágenes procesadas:', imagenesProcesadas);
    res.redirect('/perfil');

  } catch (error) {
    console.error('Error al subir imágenes:', error);
    res.status(500).send('Error al subir imágenes: ' + error.message);
  }
};


export const albumController = {
    mostrarAlbumes,
    crearAlbum,
    crearImagen,
    editarAlbum
}
