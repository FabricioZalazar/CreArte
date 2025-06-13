import  Usuario  from '../models/usuarioModel.js';
import bcrypt from 'bcryptjs';

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
  res.redirect('/login.html');
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.buscarPorEmail(email);

  if (!usuario) return res.status(401).send('Email incorrecto');
  const esValido = await bcrypt.compare(password, usuario.contraseña);
  if (!esValido) return res.status(401).send('Contraseña incorrecta');

  req.session.usuario = {
    id: usuario.idUsuario,
    nombre: usuario.nombre,
    apellido: usuario.apellido
  };

  res.redirect('/perfil.html');
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
};

const mostrarPerfil = async (req, res) => {
  try {
    const id = req.session.usuario.id;
    const usuario = await Usuario.buscarPorId(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const usuarioController = {
  registrar,
  login,
  logout,
  mostrarPerfil
};