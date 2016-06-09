'use strict'

var Yelp = require('yelp');
var yelpKeys = require('../../api_keys').yelpKeys;

let yelp = new Yelp({
  consumer_key: yelpKeys.consumer_key,
  consumer_secret: yelpKeys.consumer_secret,
  token: yelpKeys.token,
  token_secret: yelpKeys.token_secret
});

yelp.searchYelp = (searchPreferences, callback) => {

  yelp.search(searchPreferences)
  .then((jsonData) => {
    var randomIndex = Math.floor(Math.random() * jsonData.businesses.length);
    var chosen = jsonData.businesses[randomIndex];
    callback(chosen);
  })
  .catch((error) => {
    console.log('Error:', error);
  });
};

module.exports = yelp;