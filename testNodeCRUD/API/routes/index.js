const registrationRoutes = require('./registation');
// const chatIntentIdentifer = require('./chatIntentIdentifier');

module.exports = (app) => {
    app.use('/chatme/', registrationRoutes);
    // app.use('/chatme/', chatIntentIdentifer. );
};