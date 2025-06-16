import con from '../db.js';

const crear = async ({ idAlbum, fecha, caption, rutaImagen, status }) => {
    await console.log(caption.value +'----'+ idAlbum+'----' + rutaImagen)
    const [result] = await con.query(`INSERT INTO imagen (idAlbum, fecha, caption, rutaImagen, status) VALUES (?, ?, ?, ?, ?) `, [
        idAlbum,
        fecha,
        caption,
        rutaImagen,
        status
    ]);
     console.log('Creo la Imagen'+result);
    return result.insertId;
};

const obtenerPorAlbum = async (idAlbum) => {
    const sql = `SELECT * FROM imagen WHERE idAlbum = ? AND status = 1 ORDER BY fecha DESC`;
    const [rows] = await con.execute(sql, [idAlbum]);
    return rows;
};

export default {
    crear,
    obtenerPorAlbum,
};
