const { Router } = require('express');
const { body } = require('express-validator');

// Controladores
const {
    inicio,
    formularioProyecto,
    nuevoProyecto,
    obtenerProyecto,
    formularioEditar,
    actualizarProyecto,
    eliminarProyecto
} = require('../controllers/controladorProyectos');

const {
    nuevaTarea,
    cambiarEstadoTarea,
    eliminarTarea
} = require('../controllers/controladorTareas');

const {
    formularioCrearCuenta,
    formularioIniciarSesion,
    crearCuenta,
    confirmarCuenta,
    formularioRestablecerPassword
} = require('../controllers/controladorUsuarios');

const controladorAutenticacion = require('../controllers/controladorAutenticacion');

const router = Router();

/* Usuarios */

// Crear nueva cuenta 
router.get('/crear-cuenta', formularioCrearCuenta);
router.post('/crear-cuenta', crearCuenta);
router.get('/confirmar/:correo', confirmarCuenta);

// Iniciar sesión
router.get('/iniciar-sesion', formularioIniciarSesion);
router.post('/iniciar-sesion', controladorAutenticacion.autenticarUsuario);

// Cerra sesión
router.get('/cerrar-sesion', controladorAutenticacion.cerrarSesion);

// Reestablecer contraseña
router.get('/restablecer-password', formularioRestablecerPassword);
router.post('/restablecer-password', controladorAutenticacion.enviarToken);
router.get('/restablecer-password/:token', controladorAutenticacion.validarToken);
router.post('/restablecer-password/:token', controladorAutenticacion.actualizarPassword);

/* Proyectos */

// Inicio
router.get('/',
    controladorAutenticacion.usuarioAutenticado,
    inicio
);

// Crear proyecto
router.get('/nuevo-proyecto',
    controladorAutenticacion.usuarioAutenticado,
    formularioProyecto
);

router.post('/nuevo-proyecto',
    controladorAutenticacion.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    nuevoProyecto
);

// Obtener proyecto
router.get('/proyectos/:url',
    controladorAutenticacion.usuarioAutenticado,
    obtenerProyecto
);

// Actualizar proyecto
router.get('/proyecto/editar/:id',
    controladorAutenticacion.usuarioAutenticado,
    formularioEditar
);

router.post('/nuevo-proyecto/:id',
    controladorAutenticacion.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    actualizarProyecto
);

// Elimina proyecto
router.delete('/proyectos/:url',
    controladorAutenticacion.usuarioAutenticado,
    eliminarProyecto
);

/* Tareas */

// Crear tarea
router.post('/proyectos/:url',
    controladorAutenticacion.usuarioAutenticado,
    nuevaTarea
);

// Actualizar tarea - Estado 0 = incompleta 1 = completa
router.patch('/tareas/:id',
    controladorAutenticacion.usuarioAutenticado,
    cambiarEstadoTarea
);

// Eliminar tarea
router.delete('/tareas/:id',
    controladorAutenticacion.usuarioAutenticado,
    eliminarTarea
);

module.exports = router;