const ChatStarter = require('../models/chatStarter');
const reminderController = require('../controllers/ReminderController');
const noteController = require('../controllers/NoteController');

let chatStarters = [];
const loadChatStarters = async () => {
    const loadedChatStarters = await ChatStarter.find({}).exec();
    chatStarters = loadedChatStarters;
};

const addChatStarters = async (req, res, next) => {
    console.log('Inside chat starter');

    const starterName = (req.body.starterName).toLowerCase();
    const type = (req.body.type).toLowerCase();
    const phrase = req.body.phrase;

    const chatStarters = await ChatStarter.find({ starterName, type });

    if (chatStarters[0] === undefined) {
        let newPhrase = [];
        newPhrase.push(phrase);
        const newChatStarter = new ChatStarter({
            starterName,
            type,
            phrases: newPhrase
        });

        const registeredChatStarter = await newChatStarter.save();
        return res.json(registeredChatStarter);
    }
    else {
        let updatedPhrase = chatStarters[0].phrases;
        updatedPhrase.push(phrase);
        const updatedChatStarter = await ChatStarter.updateOne(
            { _id: chatStarters[0].id },
            { $set: { phrases: updatedPhrase } }
        );
        console.log('updated result is  ' + updatedChatStarter);
        return res.json({ updatedChatStarter });
    }
};


const dialogStarter = async (req, res, next) => {
    console.log('Inside  chatStarter');
    try {
        let dialog = req.body.dialog;
        let speech = dialog.speech;
        let searchOnTheInternet = true;
        chatStarters.forEach(chatStarter => {
            chatStarter.phrases.forEach(chatStarterPhrase => {
                // forward to the respective handler
                if (speech.toLowerCase().startsWith(chatStarterPhrase)) {
                    console.log('Chat starter phrase is ' + chatStarterPhrase + 'It is found at ' + chatStarter.starterName, chatStarter.type);
                    // to get the subject matter
                    req.locals.subjectText = speech.toLowerCase().replace(chatStarterPhrase, '');
                    req.locals.dialog = dialog;
                    if (chatStarter.starterName === 'reminder') {
                        searchOnTheInternet = false;
                        if (chatStarter.type === 'create') {
                            console.log('At create reminder');
                            return reminderController.getReminderEntities(req, res, next);
                        }
                        else if (chatStarter.type === 'get') {
                            console.log('At get reminder');
                            return reminderController.allReminders(req, res, next);
                        }
                        else if (chatStarter.type === 'cancel') {
                            console.log('At cancel reminder');
                            return reminderController.cancelReminder(req, res, next);
                        }
                    }
                    else if (chatStarter.starterName === 'note') {
                        searchOnTheInternet = false;
                        //test note features
                        if (chatStarter.type === 'create') {
                            console.log('At create note');
                            return noteController.createNote(req, res, next);
                        }
                        else if (chatStarter.type === 'get') {
                            console.log('At get note');
                            return noteController.allNotes(req, res, next);
                        }
                        else if (chatStarter.type === 'search') {
                            console.log('At search note');
                            return noteController.getNotes(req, res, next);
                        }
                    }
                }
            })

        });

        //search db and if no match, search on the internet
        if (searchOnTheInternet)
            return res.json({ "status": "No match found", "google": true });
    }

    catch (err) {
        console.log('Thrown at chatStarter inside chatStarter controller');
        console.log(err);
        return next(err);
    }
};

module.exports.addChatStarters = addChatStarters;
module.exports.loadChatStarters = loadChatStarters;
module.exports.dialogStarter = dialogStarter;