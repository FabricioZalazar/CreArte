import con from '../db.js';

const Usuario = {

  buscarPorEmail: async (email) => {
    const [rows] = await con.query('SELECT * FROM usuario WHERE email = ?', [email]);
    return rows[0];
  },

  buscarPorId: async (idUsuario) => {
    const [rows] = await con.query('SELECT * FROM usuario WHERE idUsuario = ?', [idUsuario]);
    return rows[0];
  },

  crear: async (usuario) => {
    const { nombre, apellido, email, contraseña } = usuario;
    const [result] = await con.query(
      'INSERT INTO usuario (nombre, apellido, email, contraseña, sessionKey) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, email, contraseña, '']
    );
    return result.insertId;
  },

  traerTodosLosUsuarios: async ()=>{
    const [rows] = await con.query('SELECT * FROM usuario');
    return rows;
  },

   buscarPorNombre: async (nombre)=>{
    const patron = `%${nombre}%`;
    const [rows] = await con.query('SELECT * FROM usuario WHERE nombre LIKE ?',[patron]);
    return rows[0];
  }
};

export default Usuario;
