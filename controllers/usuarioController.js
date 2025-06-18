import Usuario from '../models/usuarioModel.js';
import bcrypt from 'bcryptjs';
import album from '../models/albumModel.js';


const usuarioInfo = async (req, res) => {
  try {
    const usuario = await Usuario.buscarPorId(req.params.id);
  
    res.status(200).json(usuario);

  } catch (error) {
    console.error('Error al obtener Usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

const usuario = async (req, res) => {
  try {
    const idUsuario = req.params.id;
    const usuarioLogueado = req.session.usuario;

    const usuario = await Usuario.buscarPorId(idUsuario);
    const albumes = await album.obtenerConPortada(idUsuario);
    const yaLoSigo = await Usuario.sigue(usuarioLogueado.idUsuario, idUsuario);

    res.render('perfilUsuario', {
      usuario,
      albumes,
      yaLoSigo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno');
  }
};

const mostrarPerfilAjeno = async (req, res) => {
  try {
    const idUsuario = req.params.id; // El usuario que estás visitando
    const usuarioLogueado = req.session.usuario; // El que está logueado

    const usuario = await Usuario.buscarPorId(idUsuario);
    const albumes = await album.obtenerConPortada(idUsuario);

    const seguidores = await Usuario.obtenerSeguidores(idUsuario); // devuelve array con nombre/apellido
    const seguidos = await Usuario.obtenerSeguidos(idUsuario);

    const yaLoSigo = await Usuario.sigue(usuarioLogueado.idUsuario, idUsuario);

    res.render('perfilUsuario', {
      usuario: {
        ...usuario,
        seguidores,
        seguidos,
      },
      albumes,
      yaLoSigo,
      session: req.session, // Para usar el id del logueado en el pug
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno al mostrar perfil');
  }
};

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
  try {
    const usuario = await Usuario.buscarPorId(req.session.usuario.idUsuario); // tu método para obtener datos del usuario
    const albumes = await album.obtenerConPortada(usuario.idUsuario);
    const seguidores = await Usuario.obtenerSeguidores(usuario.idUsuario);
    const seguidos = await Usuario.obtenerSeguidos(usuario.idUsuario);

    res.render('perfil', {
      usuario: {
        ...usuario,
        seguidores,
        seguidos,
      },
      albumes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno');
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.buscarPorEmail(email);

  if (!usuario) {
    return res.render('login', { error: 'Email incorrecto' });
  }

  const esValido = await bcrypt.compare(password, usuario.contraseña);
  if (!esValido) {
    return res.render('login', { error: 'Contraseña incorrecta' });
  }

  req.session.usuario = usuario;
  res.redirect('/perfil');
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.render('login');
  });
};

const buscarUsuarios = async (req, res) => {
  try {
    const termino = req.query.termino || '';
    const resultados = await Usuario.buscarUsuariosPorNombre(termino);
    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};



export const usuarioController = {
  registrar,
  login,
  logout,
  mostrarPerfil,
  usuarioInfo,
  usuario,
  mostrarPerfilAjeno,
  buscarUsuarios
};