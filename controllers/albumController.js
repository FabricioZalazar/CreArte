import albumModel from "../models/albumModel.js";
import imagenModel from "../models/imagenModel.js";
import comentarioModel from "../models/comentarioModel.js";


const imagenesPorAlbum = async (req, res) => {
  try {
    const imagenes = await imagenModel.obtenerPorAlbum(req.params.id);
    if (!imagenes || imagenes.length === 0) {
      return res.status(404).json({ mensaje: 'Álbum sin imágenes' });
    }
    res.json(imagenes);
  } catch (error) {
    console.error('Error al buscar imágenes:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


const infoAlbum = async (req, res) => {
  try {
    const idAlbum = req.params.id;

    const album = await albumModel.buscarPorId(idAlbum);

    if (!album) {
      return res.status(404).json({ mensaje: 'Álbum no encontrado' });
    }

    res.status(200).json(album);

  } catch (error) {
    console.error('Error al obtener álbum:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const comentariosPorImagen = async (req, res) => {
  try {

    const comentarios = await comentarioModel.obtenerPorImagen(req.params.id);
    res.status(200).json(comentarios);

  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};




const borrarAlbum = async (req, res) => {
  try {
    const { idAlbum } = req.body;

    await imagenModel.borrarPorAlbum(idAlbum);

    await albumModel.eliminar(idAlbum);

    res.redirect('/perfil');

  } catch (error) {
    console.error('Error al borrar el álbum:', error);
    res.status(500).send('Error al borrar el álbum');
  }
};



const crearAlbum = async (req, res) => {
   console.log('📥 Entró al controlador crearAlbum');
  try {
    const { titulo, descripcion, modo, destacado } = req.body;
    const idUsuario = req.session.usuario.idUsuario;

    const archivos = req.files;
    const indexPortada = parseInt(req.body.imagenPortada, 10);
    const portadaUrl = archivos[indexPortada]?.path; 
    
    const nuevoAlbumId = await albumModel.crear({
      idUsuario,
      titulo,
      descripcion,
      modo,
      destacado: destacado ? 1 : 0,
      portada: null, 
    });

    let idImagenPortada = null;

    for (const archivo of archivos) {
      const rutaImagen = archivo.path; 
      const idImagen = await imagenModel.crear({
        idAlbum: nuevoAlbumId,
        fecha: new Date(),
        caption: null,
        rutaImagen,
        status: 1,
      });

      if (archivo.path === portadaUrl) {
        idImagenPortada = idImagen;
      }
    }

    if (idImagenPortada) {
      await albumModel.actualizarPortada(nuevoAlbumId, idImagenPortada);
    }

    res.redirect('/perfil');
  } catch (error) {
    console.log('Error al crear álbum:', error);
    res.status(5000).send('Error interno del servidor'+ error);
  }
};



export const albumController = {
  crearAlbum,
  imagenesPorAlbum,
  borrarAlbum,
  infoAlbum,
  comentariosPorImagen
}
