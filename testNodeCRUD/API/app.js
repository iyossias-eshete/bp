require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const routeRegister = require('./routes/index');

const app = express();

const mongoUtil = require('./utils/mongoUtil');
mongoUtil.connectToDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
routeRegister(app);

// to be moved to index
const chatStarterController = require('./controllers/chatStarterController');
const tokenUtil = require('./utils/tokenUtil');
app.post('/chatme/discord', tokenUtil.verifyToken, chatStarterController.dialogStarter);
app.post('/chatme/addChatStarters', tokenUtil.verifyToken, chatStarterController.addChatStarters);
//

app.listen(process.env.PORT_NUMBER);
