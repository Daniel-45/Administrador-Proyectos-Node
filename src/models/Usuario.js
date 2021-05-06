const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const db = require('../configuration/db');
const Proyecto = require('../models/Proyecto');

const Usuario = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(80),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'El e-mail debe tener un formato correcto'
            },
            notEmpty: {
                msg: 'El e-mail es obligatorio'
            }
        },
        unique: {
            args: true,
            msg: 'Ya existe un usuario con ese email'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña es obligatoria'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
},  {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

// Métodos personalizados
Usuario.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

// Relación tablas 1:n
// Un usuario puede crear muchos proyectos
Usuario.hasMany(Proyecto);

module.exports = Usuario;