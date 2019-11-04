const jsonWebToken = require('jsonwebtoken');
const JWT_SECRET_KEY = 'P@$$w0rd';

exports.signUser = (req, res, next) => {
    try {
        const payload = req.body.phoneNumber;
        const token = jsonWebToken.sign(payload, JWT_SECRET_KEY);
        console.log(token + '  s ');
        //req.locals = {};
        //req.locals.token = token;
        res.json({token});
        next();
    }
    catch (err) {
        console.log('Thrown at signUser inside tokenUtil');
        console.log(err);
        return res.json(err);
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
            authData = jsonWebToken.verify(receivedToken, JWT_SECRET_KEY);
        }
        catch (err) {
            console.log('Thrown at verifyToken jwt.verify method inside tokenUtil');
            console.log(err);
            return res.json(err);
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
        return res.json(err);
    }
};