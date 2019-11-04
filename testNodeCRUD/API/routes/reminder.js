const router = require('express').Router();
// const validator = require('../utils/validatorUtil');
const ReminderController = require('../controllers/ReminderController');
const tokenUtil = require('../utils/tokenUtil');
const errorHandlers = require('../utils/errorHandlerUtil');

router.post('/reminder',
tokenUtil.verifyToken,
ReminderController.createReminder,
//
errorHandlers);

router.post('/getReminder/',
tokenUtil.verifyToken,
ReminderController.allReminders,
errorHandlers
);

router.post('/getReminder',
tokenUtil.verifyToken,
ReminderController.getReminder,
//
errorHandlers
);

// router.get('/reminder/:name',
// tokenUtil.verifyToken,
// ReminderController.findReminderByName,
// errorHandlers
// );

router.post('/createReminder',
tokenUtil.verifyToken,
ReminderController.createReminder,
//
errorHandlers);



// router.post('/register',
//     validator.registerUser,
//     UserController.registerUser,
//     tokenUtil.signUser,
//     (req,res,next)=>{
//         res.send(`Registered! ${req.locals.registeredUser} with ${req.locals.token}`);
//     },
//     errorHandlers
// );

// // localhost:3000/api/v1/queries
// // chat-me.herokuapp.com/api/v1/queries

// //todo
// router.post('/getRemainder', tokenUtil.verifyToken, (req, res) => {
//     res.send('Verified. Here is ur remainder');
// });

// //jwt is given when the user logs in, hence on post login
// router.post('/signIn', tokenUtil.signInUser, UserController.login,
// (req,res)=>{
//    console.log('You are signed in!');
// }
// );

// router.get('/reminders', tokenUtil.verifyToken, (req,res,next)=>{
//     console.log('You are verified!');
// });

module.exports = router;