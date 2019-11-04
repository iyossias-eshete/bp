const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const tokenUtil = require('../utils/tokenUtil');

const validator = require('../utils/validatorUtil');

router.post('/register',
validator.registerUser,
userController.registerUser,
tokenUtil.signUser,
);

router.get('/',
tokenUtil.verifyToken,
(req,res,next)=>{
    res.send('trying to get registed now:');
});

module.exports = router;