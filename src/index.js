const express = require('express');
const rutas = require('./routes');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./configuration/passport');
require('dotenv').config({ path: '.env' });

// Helpers
const helpers = require('./helpers/helpers');

// Conexión a la base de datos
const db = require('./configuration/db');

// Importar el modelo
require('./models/Proyecto');
require('./models/Tarea');
require('./models/Usuario');

db.sync()
    .then(() => console.log('Conexión a la base de datos realizada con éxito'))
    .catch(error => console.log(error))

const app = express();

// Templete engine
app.set('view engine', 'pug');

// Archivos estáticos
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));

// Vistas
app.set('views', path.join(__dirname, './views'));

// Flash messages
app.use(flash());

app.use(cookieParser());

// Sesiones
app.use(session({
    secret: 'cadena-secreta',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = { ...req.user } || null;
    next();
});

// Rutas
app.use('/', rutas);

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log(`Servidor escuchando en http://${host}:${port}`);
});