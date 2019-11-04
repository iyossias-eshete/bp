//require('dotenv').config();


const express = require('express');
const bodyParser = require('body-parser');
const indexRoute = require('./routes/index');
const mongoUtil = require('./utils/mongoUtil');

mongoUtil.connectToDB();


const app = express();


app.use(bodyParser.urlencoded({extended : true }));
app.use(bodyParser.json());

indexRoute(app);


app.listen(3400);