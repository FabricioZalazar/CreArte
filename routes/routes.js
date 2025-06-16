import {usuarioController} from '../controllers/usuarioController.js';
import {albumController} from '../controllers/albumController.js';
import upload from '../middlewares/upload.js';
import express from 'express';
const router = express.Router();

function verificarLogin(req, res, next) {
  if (!req.session.usuario) return res.render('login')
  next();
}

router.post('/album/crear',verificarLogin, albumController.editarAlbum);
router.post('/album/editar',verificarLogin, albumController.crearAlbum);
router.post('/imagenes/subir', upload.array('imagenes'), albumController.crearImagen);
router.post('/registro', usuarioController.registrar);
router.post('/login', usuarioController.login);
router.get('/logout', usuarioController.logout);
router.get('/perfil', verificarLogin, usuarioController.mostrarPerfil);
router.get('/usuario/:id', verificarLogin, albumController.mostrarAlbumes);

export default router;