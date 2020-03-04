/**Ruta .exe mongod: C:\Program Files\MongoDB\Server\4.2\bin, se ejecuta en git CMD deprecat */

/**Requires */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


/**Inicializar variables */
var app = express();


/**Body parser */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/**Impotar Rutas */
var appRoutes = require('./routes/app');
var usarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

/**Conexion DB local mongodb*/
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

/**Se ejecuta antes que se resuelvan otras Rutas */
app.use('/Usuario', usarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

/**Escuchar peticiones */
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});