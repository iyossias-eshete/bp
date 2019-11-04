const chatStatersController = require('../controllers/chatStarterController');

const dataInitializer = async ()=> {
    console.log('Initializing data from the DB!');
    await chatStatersController.loadChatStarters();
};

module.exports = dataInitializer;