const mongoose = require('mongoose');
const initializer = require('../utils/initializer');
let db;

const connectToDB = async() => {
    try{
        mongoose.connect(process.env.DB_URL,
            { useNewUrlParser: true, useUnifiedTopology: true },
            async (err, client) =>  {
                if (err) {
                    console.log('error occured during connection' + err);
                    db = null;
                    return;
                }
                await initializer();
                console.log('Connected! Client is ' + client);
                db = client;
            });
    }
    catch(err){
        console.log('DB connection error');
        console.log(err);
    }
};

module.exports.connectToDB = connectToDB;
