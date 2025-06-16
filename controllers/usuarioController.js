import Usuario from '../models/usuarioModel.js';
import bcrypt from 'bcryptjs';
import album from '../models/albumModel.js';
import {albumController} from '../controllers/albumController.js';

const registrar = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  const existente = await Usuario.buscarPorEmail(email);
  if (existente) return res.status(400).send('Ya existe un usuario con ese email');

  const contraseñaHash = await bcrypt.hash(password, 10);

  const nuevoUsuario = {
    nombre,
    apellido,
    email,
    contraseña: contraseñaHash
  };

  await Usuario.crear(nuevoUsuario);
  res.render('login');
}

const mostrarPerfil = async (req, res) => {
  const usuario = req.session.usuario
  const albumes = await album.listarPorUsuario(usuario.idUsuario);
  res.render('perfil', { usuario, albumes });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.buscarPorEmail(email);
  if (!usuario) return res.status(401).send('Email incorrecto');
  const esValido = await bcrypt.compare(password, usuario.contraseña);
  if (!esValido) return res.status(401).send('Contraseña incorrecta');

  req.session.usuario = usuario;

  const albumes = await album.listarPorUsuario(usuario.idUsuario);
  res.render('perfil', { usuario: req.session.usuario, albumes });
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.render('login');
  });
};


export const usuarioController = {
  registrar,
  login,
  logout,
  mostrarPerfil
};