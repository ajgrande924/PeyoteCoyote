'use strict';

var controller = require('./controller.js');

module.exports = function (app) {
  app.post('/signup', controller.signup);
  app.post('/signin', controller.signin);
  app.post('/sendTxt', controller.sendSMS);
  app.post('/checkCode', controller.checkCode);
  app.post('/verified', controller.verifyUser);
  app.post('/isVerified', controller.isUserVerified);
  app.post('/roam', controller.roam);
  app.post('/cancelRoam', controller.cancelRoam);
  app.post('/history', controller.populateHistory);
  app.post('/isRoaming', controller.isRoaming);
};