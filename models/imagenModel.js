import con from '../db.js';
import fs from 'fs/promises';
import path from 'path';

const crear = async ({ idAlbum, fecha, caption, rutaImagen, status }) => {
  const sql = `
    INSERT INTO imagen (idAlbum, fecha, caption, rutaImagen, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  const valores = [idAlbum, fecha, caption, rutaImagen, status];

  const [resultado] = await con.query(sql, valores);
  return resultado.insertId;
}

const obtenerPorAlbum = async (idAlbum) => {
    const sql = `SELECT * FROM imagen WHERE idAlbum = ? AND status = 1 ORDER BY fecha DESC`;
    const [rows] = await con.execute(sql, [idAlbum]);
    return rows;
};

const obtenerPorId = async (idImg) => {
    const [rows] = await con.execute(`SELECT * FROM imagen WHERE idImg = ?`, [idImg]);
    return rows[0];
};

const eliminarFisico = async (idImg) => {
    const [result] = await con.execute(`DELETE FROM imagen WHERE idImg = ?`, [idImg]);
    return result.affectedRows > 0;
};


const borrarPorAlbum = async (idAlbum) => {
  try {

    const [imagenes] = await con.query(
      'SELECT rutaImagen FROM imagen WHERE idAlbum = ?',
      [idAlbum]
    );

    const [result] = await con.query(
      'DELETE FROM imagen WHERE idAlbum = ?',
      [idAlbum]
    );
    return result;
  } catch (error) {
    console.error('Error al borrar imágenes del álbum:', error);
    throw error;
  }
};


  
const eliminarLogico = async (idImg) => {
    const [result] = await con.execute(`UPDATE imagen SET status = 0 WHERE idImg = ?`, [idImg]);
    return result.affectedRows > 0;
};

const actualizarCaption = async (idImg, nuevoCaption) => {
    const [result] = await con.execute(`UPDATE imagen SET caption = ? WHERE idImg = ?`, [nuevoCaption, idImg]);
    return result.affectedRows > 0;
};

const actualizarPortada = async (idAlbum, nuevaPortada) => {
    const [result] = await con.execute(`UPDATE album SET portada = ? WHERE idAlbum = ?`, [nuevaPortada, idAlbum]);
    return result.affectedRows > 0;
};

export default {
    crear,
    obtenerPorAlbum,
    obtenerPorId,
    eliminarFisico,
    eliminarLogico,
    actualizarCaption,
    actualizarPortada,
    borrarPorAlbum
};
