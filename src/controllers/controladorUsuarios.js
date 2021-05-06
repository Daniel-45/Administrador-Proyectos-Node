const Usuario = require('../models/Usuario');
const enviarEmail = require('../handlers/email');

const formularioCrearCuenta = (req, res) => {
    res.render('formulario-registro', {
        titulo: 'Crear Cuenta'
    })
}

const formularioIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('formulario-login', {
        titulo: 'Iniciar Sesión',
        error
    })
}

const crearCuenta = async (req, res) => {
    // leer datos del formulario
    const { email, password } = req.body;

    try {
        await Usuario.create({ 
            email, 
            password 
        });

        // Crear URL de confirmación para la cuenta
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // Crear objeto de usuario
        const usuario = {
            email
        }

        // Redirigir al usuario
        req.flash('correcto', 'Enviamos un correo a tu e-mail, confirma tu cuenta');
        res.redirect('/iniciar-sesion');

        // Enviar e-mail
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta en UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('formulario-registro', {
            mensajes: req.flash(),
            titulo: 'Crear Cuenta',
            email,
            password
        })
    }
}

const confirmarCuenta = async (req, res) => {
    const usuario = await Usuario.findOne({
        where:  {
            email: req.params.correo
        }
    });

    // Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe el usuario');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion')
}

const formularioRestablecerPassword = (req, res) => {
    res.render('restablecer-password'), {
        titulo: 'Restablecer Contraseña'
    }
}

module.exports = {
    formularioCrearCuenta,
    formularioIniciarSesion,
    crearCuenta,
    confirmarCuenta,
    formularioRestablecerPassword
}