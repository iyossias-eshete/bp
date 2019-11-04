const { check } = require('express-validator');

exports.registerUser =
    [
       // check('email').isEmail(),
        check('phoneNumber').isMobilePhone()
    ];