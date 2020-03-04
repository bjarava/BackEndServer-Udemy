var jwt = require('jsonwebtoken');

/**llamado al .config */
var SEED = require('../config/config').SEED;

//===============================
//Varificar token
//===============================
exports.verificartoken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'token incorrecto',
                error: err
            });
        }
        req.usuario = decoded.usuario;
        /**res.status(200).json({
            ok: true,
            decoded: decoded
        });*/

        next();
    });
}