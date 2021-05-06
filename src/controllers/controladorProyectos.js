const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');

const inicio = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyecto.findAll({ where: { usuarioId } });

    res.render('index', {
        titulo: 'Proyectos',
        proyectos
    });
}

const formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyecto.findAll({ where: { usuarioId } });

    res.render('nuevo-proyecto', {
        titulo: 'Nuevo Proyecto',
        proyectos
    });
}

const nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyecto.findAll({ where: { usuarioId } });

    const { nombre } = req.body;

    let errores = [];

    // Validar formulario
    if (!nombre) {
        errores.push({ 'texto': 'El nombre del proyecto es obligatorio' })
    }

    if (errores.length > 0) {
        res.render('nuevo-proyecto', {
            titulo: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    } else {
        // Usuario autenticado
        const usuarioId = res.locals.usuario.id;

        // Insertar en base de datos
        await Proyecto.create({ nombre, usuarioId });
        res.redirect('/');
    }
}

const obtenerProyecto = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;

    const proyectosPromise = Proyecto.findAll({ where: { usuarioId } });

    const proyectoPromise = Proyecto.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // Consultar tareas del proyecto actual
    const tareas = await Tarea.findAll({
        where: {
            proyectoId: proyecto.id
        }
    });

    if (!proyecto) return next();

    res.render('tareas', {
        titulo: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

const formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectosPromise = Proyecto.findAll({ where: { usuarioId } });

    const proyectoPromise = Proyecto.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevo-proyecto', {
        titulo: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

const actualizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyecto.findAll({ where: { usuarioId } });

    const { nombre } = req.body;

    let errores = [];

    // Validar formulario
    if (!nombre) {
        errores.push({ 'texto': 'El nombre del proyecto es obligatorio' })
    }

    if (errores.length > 0) {
        res.render('nuevo-proyecto', {
            titulo: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    } else {
        // Actualizar en base de datos
        await Proyecto.update(
            { nombre: nombre },
            { where: { id: req.params.id } }
        );
        res.redirect('/');
    }
}

const eliminarProyecto = async (req, res, next) => {
    const { urlProyecto } = req.query;

    const resultado = await Proyecto.destroy({ where: { url: urlProyecto } });

    if (!resultado) {
        return next();
    }

    res.status(200).send('Proyecto eliminado correctamente');
}

module.exports = {
    inicio,
    formularioProyecto,
    nuevoProyecto,
    obtenerProyecto,
    formularioEditar,
    actualizarProyecto,
    eliminarProyecto
}