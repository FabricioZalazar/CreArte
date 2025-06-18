import con from '../db.js';


const albumModel = {

    crear: async (album) => {
        const { idUsuario, titulo, modo, descripcion, destacado, portada } = album;
        const [result] = await con.query('INSERT INTO album(idUsuario, titulo, modo, descripcion, destacado, portada) VALUES (?, ?, ?, ?, ?, ?)', [idUsuario, titulo, modo, descripcion, destacado, portada]);
        return result.insertId;
    },

    buscarPorId: async (id) => {
        const [result] = await con.query('SELECT * FROM album WHERE idAlbum = ?', [id]);
        return result[0];
    },
    
    listarPorUsuario: async (idUsuario) => {
        const [result] = await con.query('SELECT * FROM album WHERE idUsuario = ?', [idUsuario]);
        return result;
    },

    obtenerConPortada: async (idUsuario) => {
        const sql = `
    SELECT a.*, i.rutaImagen AS portadaRuta
    FROM album a
    LEFT JOIN imagen i ON a.portada = i.idImg
    WHERE a.idUsuario = ?;
  `;
        const [rows] = await con.execute(sql, [idUsuario]);
        return rows;
    },

    editar: async (id, datos) => {
        const { titulo, modo, descripcion, destacado, portada } = datos;
        const [result] = await con.query(
            'UPDATE album SET titulo = ?, modo = ?, descripcion = ?, destacado = ? , portada = ? WHERE idAlbum = ?',
            [titulo, modo, descripcion, destacado, id, portada]
        );
        return result.affectedRows > 0;
    },

    eliminar: async (id) => {
        const [result] = await con.query('DELETE FROM album WHERE idAlbum = ?', [id]);
        return result.affectedRows > 0;
    },


    actualizarPortada: async (idAlbum, idImagenPortada) => {
        const sql = 'UPDATE album SET portada = ? WHERE idAlbum = ?';
        const valores = [idImagenPortada, idAlbum];
        await con.query(sql, valores);
    }


};

export default albumModel;



