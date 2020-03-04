var express = require('express');
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

/**llamado al .config */
//var SEED = require('../config/config').SEED;

var mdAutenticacion = require('../middlewares/autenticacion');

/**Llamando la app */
var app = express();
/**Llamado al modelo de usuarios */
var Usuario = require('../models/usuario');


//===============================
//Obtener todos los usuarios
//===============================
/**Rutas */
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuario',
                        error: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            });
});

//===============================
//Actualizar usuario
//===============================
app.put('/:id', mdAutenticacion.verificartoken, (req, res) => {
    var id = req.params.id;
    var body = req.body;


    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al consultar usuario',
                error: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con id ' + id + ' no existe',
                error: { message: 'No existe un usario con ese ID' }
            });
        }

        /**Instanciamos el usuario para cargar l que devuelve el body */
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    error: err
                });
            }
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });
    });

});

//===============================
//Crear un nuevo usuario
//===============================
app.post('/', mdAutenticacion.verificartoken, (req, res) => {

    var body = req.body;
    /**Instanciamos la clase usuario, para grabar un usuario */
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    /**Utilizamos la instancia del usuario con la funcion grabar */
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                error: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });

    });

});

//===============================
//Borrar un usuario
//===============================
app.delete('/:id', mdAutenticacion.verificartoken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuaioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al brrar  usuario',
                error: err
            });
        }

        if (!usuaioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un  usuario con ese id',
                error: err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuaioBorrado
        });
    });
});


module.exports = app;