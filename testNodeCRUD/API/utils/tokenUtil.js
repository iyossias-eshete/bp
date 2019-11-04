const jsonWebToken = require('jsonwebtoken');
const errorUtil = require('./errorUtil');

exports.signUser = (req, res, next) => {
    try {
        const payload = req.locals.phoneNumber;
        const token = jsonWebToken.sign(payload, process.env.JWT_SECRET_KEY);
        console.log('I am res locals');
        console.log(req.locals);
        req.locals.token = token;
        next();
    }
    catch (err) {
        console.log('Thrown at signUser inside tokenUtil');
        console.log(err);
        err = errorUtil.errorBuilder(err);
        return next(err);
    }
};

exports.signInUser = (req, res, next) => {
    try {
        const payload = req.body.phoneNumber; // the phoneNumber of the user
        console.log('My payload is ' + payload);
        const token = jsonWebToken.sign(payload, process.env.JWT_SECRET_KEY);
        req.locals = {token};
        next();
    }
    catch (err) {
        console.log('Thrown at signInUser inside tokenUtil');
        console.log(err);
        err = errorUtil.errorBuilder(err);
        return next(err);
    }


};

exports.verifyAssignedToken = (req, res, next) => {
    try {
        const token = req.locals.token;
        const authData = jsonWebToken.verify(token, process.env.JWT_SECRET_KEY);
        if (!authData)
            return next(errorUtil.ForbiddenForToken);
        next();
    }
    catch (err) {
        console.log('Thrown at verifyAssignedToken inside tokenUtil');
        console.log(err);
        err = errorUtil.errorBuilder(err);
        return next(err);
    }
};

exports.verifyToken = (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        const receivedToken = bearerHeader.split(' ')[1];
        if (typeof bearerHeader === 'undefined') 
            return next(errorUtil.TokenNotInReqError);
        
        let authData;
        try {
            authData = jsonWebToken.verify(receivedToken, process.env.JWT_SECRET_KEY);
        }
        catch (err) {
            console.log('Thrown at verifyToken jwt.verify method inside tokenUtil');
            console.log(err);
            return next(errorUtil.InvalidToken);
        }
        if (!authData)
            return res.sendStatus(403);
        console.log('Verified auth data is ');
        console.log(authData);
        req.locals = { authData };
        next();
    }
    catch (err) {
        console.log('Thrown at verifyToken inside tokenUtil');
        console.log(err);
        err = errorUtil.errorBuilder(err);
        return next(err);
    }
};
