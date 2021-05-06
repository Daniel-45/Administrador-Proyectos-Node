const Sequelize = require('sequelize');
const db = require('../configuration/db');
const Proyecto = require('./Proyecto');

const Tarea = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});

// Relación tablas 1:1
// 1 tarea pertenece a 1 proyecto
Tarea.belongsTo(Proyecto);

module.exports = Tarea;