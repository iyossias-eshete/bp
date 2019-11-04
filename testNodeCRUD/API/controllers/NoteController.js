const stopWord = require('stopword');
const stringSimilarity = require('string-similarity');
const minSearchMatchThreshold = 0.3;
const Note = require('../models/Note');

exports.createNote = async (req, res) => {
    console.log('Inside  create note middleware');
    try {
        console.log('Received dialog is ' + req.locals.dialog + req.locals.dialog.type + req.locals.dialog.speech);
        let noteName = req.locals.subjectText;
        let noteWords = noteName.split(' ');
        let titleLength = 3;
        let noteTitle = '';
        if (noteWords.length > titleLength) {
            for (let i = 0; i < titleLength; i++) {
                if (noteWords[i] === '' || noteWords[i] === ' ') {
                    if (titleLength + 1 < noteWords.length)
                        titleLength++;
                    continue;
                }

                noteTitle += noteWords[i] + ' ';
            }

        }
        else {
            noteTitle = noteName;
        }

        if (noteTitle === '' || noteTitle === ' ')
            return res.json({ "status": "please enter some information to save" });

        console.log('note name is  ' + noteTitle);

        const note = new Note({
            name: noteTitle,
            description: noteName,
            terms: searchTermBuilder(noteName),
            phoneNumber: req.locals.authData,
        });

        const registeredNote = await note.save();
        res.locals = {
            registeredNote,
            phoneNumber: registeredNote.phoneNumber
        };
        return res.json(registeredNote);
    }
    catch (err) {
        console.log('Thrown at createNote inside note controller');
        console.log(err);
        return next(err);
    }

};

const searchTermBuilder = (text) => {
    let searchTerms = stopWord.removeStopwords(text.split(' '));
    searchTerms = searchTerms.join(' ');
    console.log('search  term is ' + searchTerms);
    return searchTerms;
};

exports.allNotes = async (req, res, next) => {
    console.log('Inside get all Notes');
    try {
        const notes = await Note.find({
            phoneNumber: req.locals.authData
        });
        return res.json({ notes });
    }
    catch (err) {
        console.log('Thrown at all notes inside note controller');
        console.log(err);
        return next(err);
    }
};

//based on search terms
exports.getNotes = async (req, res, next) => {
    console.log('Inside get Note');
    try {
        const userNotes = await Note.find({
            phoneNumber: req.locals.authData,
        });
        let noteSearch = [];
        userNotes.forEach(userNote => {
            noteSearch.push(
                {
                    term: userNote.terms,
                    id: userNote.id
                });
        });

        if (noteSearch.length === 0) {
            return res.json({ status: "we couldn't find any notes" });
        }
        req.locals.noteSearch = noteSearch;
        let searchResult = await searchNote(req, res, next);

        if (searchResult === -1) {
            console.log('no match not found');
            return res.json({ "google": true });
        }

        // return note instead of changing status
        else {
            console.log('Match found in notes');
            const userNotes = await Note.find({
                phoneNumber: req.locals.authData,
                _id: searchResult
            });
            return res.json(userNotes);
        }
    }
    catch (err) {
        console.log('Thrown at getNotes inside note controller');
        console.log(err);
        return next(err);
    }

};

const searchNote = async (req, res, next) => {
    console.log(('Inside search note'));
    try {
        let speech = req.locals.subjectText;
        let inputtedNoteTerms = stopWord.removeStopwords(speech.split(' ')).join(' ');
        let noteSearchItems = req.locals.noteSearch;
        let noteSearchTerms = [];
        noteSearchItems.forEach(noteSearchItem => {
            noteSearchTerms.push(noteSearchItem.term);
        });

        let bestMatch = stringSimilarity.findBestMatch(inputtedNoteTerms, noteSearchTerms);

        // if match is not found
        if (bestMatch.bestMatch.rating < minSearchMatchThreshold) {
            return -1;
        }

        else {
            //return res.json({ match : `Match is ${bestMatch.bestMatch.rating} id is ${reminderSearchItems[bestMatch.bestMatchIndex].id}`})
            console.log(`Match is ${bestMatch.bestMatch.rating} id is ${noteSearchItems[bestMatch.bestMatchIndex].id}`);
            return noteSearchItems[bestMatch.bestMatchIndex].id;
        }
    }
    catch (err) {
        console.log('Thrown at searchNote inside note controller');
        console.log(err);
        return next(err);
    }
};

