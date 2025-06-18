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

  traerTodosLosUsuarios: async () => {
    const [rows] = await con.query('SELECT * FROM usuario');
    return rows;
  },

  buscarPorNombre: async (nombre) => {
    const patron = `%${nombre}%`;
    const [rows] = await con.query('SELECT * FROM usuario WHERE nombre LIKE ?', [patron]);
    return rows[0];
  },

  obtenerSeguidores: async (idUsuario) => {
    const sql = `
      SELECT u.idUsuario, u.nombre, u.apellido
      FROM amistades a
      JOIN usuario u ON a.idSeguidor = u.idUsuario
      WHERE a.idSeguido = ?
    `;
    const [rows] = await con.execute(sql, [idUsuario]);
    return rows;  
  },

  
  obtenerSeguidos: async (idUsuario) => {
    const sql = `
      SELECT u.idUsuario, u.nombre, u.apellido
      FROM amistades a
      JOIN usuario u ON a.idSeguido = u.idUsuario
      WHERE a.idSeguidor = ?
    `;
    const [rows] = await con.execute(sql, [idUsuario]);
    return rows; 
  },

  sigue: async (usuarioActualId, otroUsuarioId) => {
    const [rows] = await con.query(
      'SELECT * FROM amistades WHERE idSeguidor = ? AND idSeguido = ?',
      [usuarioActualId, otroUsuarioId]
    );
    return rows.length > 0;
  },

  seguir: async (usuarioActualId, otroUsuarioId) => {
    await con.query(
      'INSERT INTO amistades (idSeguidor, idSeguido) VALUES (?, ?)',
      [usuarioActualId, otroUsuarioId]
    );
  },

  dejarDeSeguir: async (usuarioActualId, otroUsuarioId) => {
    await con.query(
      'DELETE FROM amistades WHERE idSeguidor = ? AND idSeguido = ?',
      [usuarioActualId, otroUsuarioId]
    );
  },

  buscarUsuariosPorNombre: async (termino) => {
  const [filas] = await con.query(
    `SELECT idUsuario, nombre, apellido FROM usuario 
     WHERE nombre LIKE ? OR apellido LIKE ?`,
    [`%${termino}%`, `%${termino}%`]
  );
  return filas;
}
};

export default Usuario;