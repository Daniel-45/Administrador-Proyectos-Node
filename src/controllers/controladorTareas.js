const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');

const nuevaTarea = async (req, res, next) => {
    // Obtener proyecto actual
    const proyecto = await Proyecto.findOne({
        where: { url: req.params.url }
    });

    // Leer valor del input
    const { tarea } = req.body;

    // Estado 0 = tarea incompleta
    const estado = 0;

    const proyectoId = proyecto.id;

    // Insertar en la base de datos
    const resultado = await Tarea.create({ tarea, estado, proyectoId });

    if (!resultado) {
        next();
    }

    // Redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

const cambiarEstadoTarea = async (req, res) => {
    const { id } = req.params;
    const tarea = await Tarea.findOne({ where: { id } });

    // Cambiar estado de la tarea
    let estado = 0; // Incompleta

    if (tarea.estado === estado) {
        estado = 1;
    }

    tarea.estado = estado;

    const resultado = await tarea.save();

    if (!resultado) return next();

    res.status(200).send('Registro actualizado correctamente');
}

const eliminarTarea = async (req, res) => {
    const { id } = req.params;

    // Eliminar la tarea
    const resultado = await Tarea.destroy({ where: { id } });

    if (!resultado) return next();

    res.status(200).send('Tarea eliminada correctamente');
}

module.exports = {
    nuevaTarea,
    cambiarEstadoTarea,
    eliminarTarea
}