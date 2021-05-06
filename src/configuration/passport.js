const passport = require('passport');
const LocalStrategy = require('passport-local');

// Referencia al modelo
const Usuario = require('../models/Usuario');

// Local Strategy - Login con usuario y password
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuario.findOne({
                    where: { 
                        email ,
                        activo: 1
                    }
                });
                // El usuario existe, contraseña incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'La contraseña es incorrecta'
                    })
                }
                // El email existe y la contraseña es correcta
                return done(null, usuario)
            } catch (error) {
                return done(null, false, {
                    message: 'El usuario no existe'
                })
            }
        }
    )
);

// Serializar el objeto usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// Deserializar el objeto usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;