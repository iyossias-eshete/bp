const User = require('../models/User');
const { validationResult } = require('express-validator');
const ErrorUtil = require('../utils/errorUtil');


exports.registerUser = async (req, res, next) => {

    try {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            validationError.information = ErrorUtil.ValidationError.information;
            validationError.generatedErrorType = 'ValErr';
            return next(validationError);
        }
        const user = new User({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber
        });
        const registeredUser = await user.save();
        console.log(registeredUser);
        req.locals = {
            registeredUser,
            phoneNumber: registeredUser.phoneNumber
        };
        next();
    }
    catch (err) {
        console.log('Thrown at register user inside users controller');
        console.log(err);
        return next(err);
    }
};


exports.login = async (req, res, next) => {
    try {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            validationError.generatedErrorType = 'ValErr';
            return next(validationError);
        }
        const phoneNumber = req.body.phoneNumber;
        const user = await User.findOne({ phoneNumber }).exec();
        if (!user) {
            const invalidUser = new Error();
            invalidUser.generatedErrorType = 'InvalUserErr';
            return next(invalidUser)
        }
        // adds the user to res locals so that it can be signed
        res.json(req.locals)
        next();
    }
    catch (err) {
        console.log('Thrown at login user inside users controller');
        console.log(err);
        err = ErrorUtil.errorBuilder(err);
        return next(err);
    }
};

exports.sendRegisteredUser = async (req, res,next) => {
    try {
        let registeredUser = {};
        registeredUser.user = req.locals.registeredUser;
        registeredUser.token = req.locals.token;
        res.json(registeredUser);
    }
    catch (err) {
        console.log('Thrown at sendRegisteredUser inside users controller');
        console.log(err);
        err = ErrorUtil.errorBuilder(err);
        return next(err);
    }
};