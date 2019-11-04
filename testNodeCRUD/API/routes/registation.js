const router = require('express').Router();
const validator = require('../utils/validatorUtil');
const UserController = require('../controllers/UserController');
const tokenUtil = require('../utils/tokenUtil');
const errorHandlers = require('../utils/errorHandlerUtil');

router.post('/register',
    validator.registerUser,
    UserController.registerUser,
    tokenUtil.signUser,
    UserController.sendRegisteredUser,
    errorHandlers
);

//jwt is given when the user logs in, hence on post login
router.post('/signIn', 
tokenUtil.signInUser,
UserController.login
);

router.get('/reminders', (req,res,next)=>{
    console.log('You are not verified!');
}, tokenUtil.verifyToken, (req,res,next)=>{
    console.log('You are verified!');
});

module.exports = router;