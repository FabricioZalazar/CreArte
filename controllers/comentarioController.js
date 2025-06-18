import comentarioModel from "../models/comentarioModel.js";

const borrarComentario = async (req, res) => {
    try {
        const result = await comentarioModel.eliminar(req.params.id);
 
        if (result) {
             res.status(200).json({ mensaje: 'Borrado' });
        }else{
            res.status(200).json({ mensaje: 'NO Borrado ' });
        }


    } catch (error) {
        console.error('Error al obtener Comentario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const crearComentario = async (req, res) => {
    try {
        const {idImg, status, fecha, comentarioPadre, txt }=req.body;
        const result = await comentarioModel.crear(idImg, status, fecha, comentarioPadre, txt, req.session.usuario.idUsuario);

        
        if (result) {
             res.status(200).json({ mensaje: 'Comentario enviado' });
        }else{
            res.status(200).json({ mensaje: 'Comentario enviado NO' });
        }

    } catch (error) {
        console.error('Error al obtener Comentario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

export const comentarioController = {
    borrarComentario,
    crearComentario
};