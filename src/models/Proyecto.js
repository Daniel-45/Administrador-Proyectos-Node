const Sequelize = require('sequelize');
const slug = require('slug');
const shortid = require('shortid');

const db = require('../configuration/db');

const Proyecto = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING(100)
    },
    url: {
        type: Sequelize.STRING(100)
    }
}, {
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();

            proyecto.url = `${url}-${shortid.generate().toLowerCase()}`;
        }
    }
});

module.exports = Proyecto;