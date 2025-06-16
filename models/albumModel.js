import con from '../db.js';


const album = {

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
    }

};

export default album;



