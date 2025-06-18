import { usuarioController } from '../controllers/usuarioController.js';
import { albumController } from '../controllers/albumController.js';
import { comentarioController } from '../controllers/comentarioController.js';
import { uploadCloud } from '../config/cloudinary.js';
import Usuario from '../models/usuarioModel.js';
import express from 'express';
const router = express.Router();

function verificarLogin(req, res, next) {
  if (!req.session.usuario) return res.render('login')
  next();
}

router.get('/buscar', usuarioController.buscarUsuarios);
router.post('/usuario/seguir', verificarLogin, async (req, res) => {
  const idSeguidor = req.session.usuario.idUsuario;
  const idSeguido = req.body.idSeguido;

  await Usuario.seguir(idSeguidor, idSeguido);
  res.redirect(`/usuario/${idSeguido}`);
});

router.post('/usuario/dejar-seguir', verificarLogin, async (req, res) => {
  const idSeguidor = req.session.usuario.idUsuario;
  const idSeguido = req.body.idSeguido;

  await Usuario.dejarDeSeguir(idSeguidor, idSeguido);
  res.redirect(`/usuario/${idSeguido}`);
});
router.get('/usuario/:id', verificarLogin, usuarioController.mostrarPerfilAjeno);
router.post('/album/crear', verificarLogin,uploadCloud.array('imagenes'), albumController.crearAlbum);
router.post('/album/borrar', albumController.borrarAlbum);
router.get('/album/info/:id', albumController.infoAlbum)
router.get('/usuario/info/:id', usuarioController.usuarioInfo)
router.get('/album/:id/imagenes', albumController.imagenesPorAlbum);
router.get('/imagen/:id/comentarios', albumController.comentariosPorImagen);
router.get('/comentario/:id/borrar', comentarioController.borrarComentario);
router.post('/enviarComentario', verificarLogin, comentarioController.crearComentario);
router.post('/registro', usuarioController.registrar);
router.post('/login', usuarioController.login);
router.get('/logout', usuarioController.logout);
router.get('/perfil', verificarLogin, usuarioController.mostrarPerfil);

export default router;