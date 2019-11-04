const User = require('../models/User');
const { validationResult } = require('express-validator');

const registerUser = async (req,res, next) =>{
    try{
        console.log('Inside register user!');
        const validationError = validationResult(req);
        let errorMessage = '';
        if(!validationError.isEmpty()){
            console.log('Validation error!');
            validationError.errors.forEach(error => {
                console.log(error.param + ' ' + error.msg);
                errorMessage += error.param + ' ' + error.msg; 
            });
            return res.json(errorMessage);
            //return next(errorMessage);
        };
        
        console.log('You are verified!');
        next();
        // const user = new User({
        //     name: req.body.name,
        //     phoneNumber: req.body.phoneNumber
        // });
        // const registeredUser = await user.save();
        // console.log(registeredUser);
        // req.locals = {
        //     registeredUser,
        // };
        // next();
        
    }
    catch (err) {
        console.log('register user error at register controller');
        console.log(err);
        return next(err);
    }
};

module.exports.registerUser = registerUser;
