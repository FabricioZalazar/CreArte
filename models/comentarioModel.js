import con from '../db.js';

const crear = async ( idImg, status = 1 ,fecha, comentarioPadre = null , txt , idUsuario) => {
  const sql = `
    INSERT INTO comentario (idImg, status, fecha, comentarioPadre, txt, idUsuario)
    VALUES (?, ?, ?, ?, ?,?)
  `;

  const valores = [idImg, status, fecha, comentarioPadre, txt, idUsuario];
  const [resultado] = await con.query(sql, valores);
  return resultado.insertId;
};

const obtenerPorImagen = async (idImg) => {
  const sql = `
    SELECT * FROM comentario
    WHERE idImg = ? 
    ORDER BY fecha ASC
  `;

  const [filas] = await con.query(sql, [idImg]);
  return filas;
};

const eliminar = async (idComentario) => {
  const sql = `Delete from comentario WHERE idComentario = ?`;
  const [resultado] = await con.query(sql, [idComentario]);
  return resultado.affectedRows > 0;
};

export default {
  crear,
  obtenerPorImagen,
  eliminar,
};