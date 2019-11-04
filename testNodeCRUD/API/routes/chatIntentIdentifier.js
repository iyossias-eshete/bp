//req.body.queryResult.intent.displayName
const router = require('express').Router();
const errorHandlers = require('../utils/errorHandlerUtil');
const chatStarterController = require('../controllers/chatStarterController');
const tokenUtil = require('../utils/tokenUtil');
router.post('/dialog',
(req,res,next)=>{
    console.log('In!');
},
tokenUtil.verifyToken,chatStarterController.chatIntentIdentifer,errorHandlers);

module.exports = router;