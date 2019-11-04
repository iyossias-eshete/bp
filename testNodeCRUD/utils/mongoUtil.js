const mongoose = require('mongoose');
let db;
const DB_URL = 'mongodb://127.0.0.1:27017/ChatMe';


const connectToDB = async() => {
        mongoose.connect(DB_URL,
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
    
};

module.exports.connectToDB = connectToDB;