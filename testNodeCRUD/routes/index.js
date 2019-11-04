// requrie the different routes here
const userRoutes = require('./user');
const express = require('express');

module.exports = (app) => {
    app.use('/user' , userRoutes);
};

