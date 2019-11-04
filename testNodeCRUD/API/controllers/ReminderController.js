const Reminder = require('../models/Reminder');
const reminderStatus = require('../utils/reminderStatus');
const status = require('../utils/reminderStatus');
const stopWord = require('stopword');
const chrono = require('chrono-node');
const stringSimilarity = require('string-similarity');
const minSearchMatchThreshold = 0.3;

exports.createReminder = async (req, res) => {
  console.log('Inside  create reminder middleware');     
  try {
    console.log('Received dialog is ' + req.locals.dialog + req.locals.dialog.type + req.locals.dialog.speech);
    let reminderName = req.locals.subjectText;
    console.log('reminder name is  ' + reminderName);

    let reminderWords = reminderName.split(' ');
    let titleLength = 3;
    let reminderTitle = '';
    if (reminderWords.length > titleLength) {
      for (let i = 0; i < titleLength; i++) {
        if (reminderWords[i] === '' || reminderWords[i] === ' ') {
          if (titleLength + 1 < reminderWords.length)
            titleLength++;
          continue;
        }

        reminderTitle += reminderWords[i] + ' ';
      }

    }
    else {
      reminderTitle = reminderName;
    }

    if (reminderTitle === '' || reminderTitle === ' ')
      return res.json({ "status": "please enter your reminder" });


    if (req.locals.dialog.time != -1 || req.locals.dialog.time != '-1') {
      let remindTime = req.locals.dialog.time;
      const reminder = new Reminder({
        name: reminderTitle,
        description: reminderName,
        remindAt: remindTime,
        status: reminderStatus.active,
        terms: searchTermBuilder(reminderName, remindTime),
        phoneNumber: req.locals.authData,
      });

      const registeredReminder = await reminder.save();
      res.locals = {
        registeredReminder,
        phoneNumber: registeredReminder.phoneNumber
      };
      return res.json(registeredReminder);
    }
  }

  catch (err) {
    console.log('Thrown at createReminder inside reminder controller');
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

exports.allReminders = async (req, res, next) => {
  console.log('Inside get all Reminders');
  try {
    const reminders = await Reminder.find({
      phoneNumber: req.locals.authData,
      status: status.active
    });
    return res.json({ reminders });

  }
  catch (err) {
    console.log('Thrown at all reminders inside reminder controller');
    console.log(err);
    return next(err);
  }
};

exports.cancelReminder = async (req, res, next) => {
  console.log('Inside cancel Reminder');
  try {
    const userReminders = await Reminder.find({
      phoneNumber: req.locals.authData,
      status: status.active
    });
    let reminderSearch = [];
    userReminders.forEach(userReminder => {
      reminderSearch.push(
        {
          term: userReminder.terms.toString(),
          id: userReminder.id
        });
    });

    if (reminderSearch.length === 0) {
      return res.json({ status: "match not found" });
    }
    req.locals.reminderSearch = reminderSearch;
    let searchResult = await this.searchReminder(req, res, next);

    if (searchResult === -1) {
      console.log('Cancle reminder match not found');
      return res.json({ status: "Sorry, we couldn't find your reminder." });
    }

    else {
      console.log('Cancel reminder match found, now changing status');
      const canceledReminder = await Reminder.updateOne(
        { _id: searchResult },
        { $set: { status: status.canceled } }
      );

      return res.json({ "status": "reminder has been canceled ", canceledReminder });


    }
  }
  catch (err) {
    console.log('Thrown at cancelReminder inside reminder controller');
    console.log(err);
    return next(err);
  }

};

exports.getReminderEntities = async (req, res, next) => {
  console.log('Inside get reminder entities');
  try {
    //get entities
    this.timeChecker(req, res, next);

    if (req.locals.dialog.time === -1) {
      console.log('Returning req because time is not set');
      return res.json({
        response: "Please provide your request again and be sure to specify the time you would like to be reminded at."
      });
    }
    else {
      console.log('Time checker has passed!');
      return this.createReminder(req, res, next);
    }
  }
  catch (err) {
    console.log('Thrown at getReminderEntities by name inside reminder controller');
    console.log(err);
    return next(err);
  }
};

// checks to see if the user provided a time to be reminded at
exports.timeChecker = async (req, res, next) => {
  console.log('Inside time checker');
  try {
    let speech = req.locals.dialog.speech;
    console.log('Subject text is ' + req.locals.subjectText);
    let dateTime = chrono.parseDate(speech);
    if (dateTime === null) {
      req.locals.dialog.time = -1;
    }
    else {
      //req.locals.dialog.time = dateTime;
      req.locals.dialog.time = dateTime.toLocaleString();
    }
  }
  catch (err) {
    console.log('Thrown at timeChecker inside reminder controller');
    console.log(err);
    return next(err);
  }
}

exports.searchReminder = async (req, res, next) => {
  console.log(('Inside search reminder'));

  try {
    let speech = req.locals.subjectText;
    let inputtedReminderTerms = stopWord.removeStopwords(speech.split(' ')).join(' ');
    let reminderSearchItems = req.locals.reminderSearch;
    let reminderSearchTerms = [];
    reminderSearchItems.forEach(reminderSearchItem => {

      reminderSearchTerms.push(reminderSearchItem.term);
    });

    //let bestMatch = stringSimilarity.findBestMatch(cancelReminderTerms, reminderSearch.terms);
    let bestMatch = stringSimilarity.findBestMatch(inputtedReminderTerms, reminderSearchTerms);

    // if match is not found
    if (bestMatch.bestMatch.rating < minSearchMatchThreshold) {
      return -1;
    }

    else {
      //return res.json({ match : `Match is ${bestMatch.bestMatch.rating} id is ${reminderSearchItems[bestMatch.bestMatchIndex].id}`})
      console.log(`Match is ${bestMatch.bestMatch.rating} id is ${reminderSearchItems[bestMatch.bestMatchIndex].id}`);
      return reminderSearchItems[bestMatch.bestMatchIndex].id;
    }
  }
  catch (err) {
    console.log('Thrown at searchReminder inside reminder controller');
    console.log(err);
    return next(err);
  }
};

