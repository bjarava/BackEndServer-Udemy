var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

/**llamado al .config */
var SEED = require('../config/config').SEED;
/**Llamando la app */
var app = express();
/**Llamado al modelo de usuarios */
var Usuario = require('../models/usuario');


app.post('/', (req, res) => {


    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                error: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Las credenciaels no son correctas - Email',
                error: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Las credenciaels no son correctas - Password',
                error: err
            });
        }

        /**Creamos un token */
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas



        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id
        });

    });
});

module.exports = app;