const passport = require('passport');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Usuario = require('../models/Usuario');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Faltan credenciales'
});

exports.usuarioAutenticado = (req, res, next) => {
    // Usuario autenticado
    if (req.isAuthenticated()) {
        return next();
    }

    // Si no está autenticado
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

// Generar token si el usuario es válido
exports.enviarToken = async (req, res) => {
    // Verificar que el usuario existe
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    // Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No hay ningún usuario con ese e-mail');

        res.render('restablecer-password');
    }

    // Generar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    // Guardar en base de datos
    await usuario.save();

    // URL reset
    const resetUrl = `http://${req.headers.host}/restablecer-password/${usuario.token}`;

    req.flash('correcto', 'Se envió un mensaje a tu e-mail');
    res.redirect('/iniciar-sesion');
    
    // Envia el e-mail con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Restablecer contraseña',
        resetUrl,
        archivo: 'restablecer-password-usuario'
    });
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuario.findOne({
        where: {
            token: req.params.token
        }
    });

    // Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'Usuario no válido');
        res.redirect('/restablecer-password');
    }

    // Formulario para restablecer password
    res.render('reset-password', {
        titulo: 'Restablecer Contraseña'
    })
}

// Restablecer password
exports.actualizarPassword = async (req, res) => {
    // Verificar token válido y fecha de expiración
    const usuario = await Usuario.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    // Verificar si el usuario existe
    if (!usuario) {
        req.flash('Usuario no válido');
        res.redirect('/restablecer-password');
    }

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    // Guardar nueva contraseña
    await  usuario.save();

    req.flash('correcto', 'Contraseña actualizada correctamente');
    res.redirect('/iniciar-sesion');
}