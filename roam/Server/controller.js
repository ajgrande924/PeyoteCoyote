'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
// var bcrypt = require('bcrypt');
// var crypto = require('crypto');
var yelp = require('../App/Utils/api');
// var nodemailer = require('nodemailer');
// var gmailKeys = require('./App/Utils/apiKeys').gmailKeys;
// var formattedDateHtml = require('./App/Utils/dateFormatter');
// var generateEmail = require('./App/Utils/emailGenerator');
// var boundingBoxGenerator = require('./App/Utils/boundingBoxGenerator');
// var roamOffGenerator = require('./App/Utils/roamOffGenerator');
// var saltRounds = 10;

//Frantic_Rust Requires 
var config = require('../api_keys.js');
var twilio = require('twilio');

var client = new twilio.RestClient(config.twilioKeys.accountSid, config.twilioKeys.authToken);

var fetch = require('node-fetch');
const googlemaps_API = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&';
const mongoDB_API_KEY = 'yjH4qEJR-Olag89IaUTXd06IpuVDZWx1';
const baseLink_users = 'https://api.mlab.com/api/1/databases/frantic-rust-roam/collections/users?apiKey=';
const baseLink_users_query = 'https://api.mlab.com/api/1/databases/frantic-rust-roam/collections/users/';
const baseLink_history = 'https://api.mlab.com/api/1/databases/frantic-rust-roam/collections/history?apiKey=';
const baseLink_roams = 'https://api.mlab.com/api/1/databases/frantic-rust-roam/collections/roams?apiKey=';
const baseLink_roams_query = 'https://api.mlab.com/api/1/databases/frantic-rust-roam/collections/roams/';
const baseLink_verified = 'https://api.mlab.com/api/1/databases/frantic-rust-roam/collections/verified?apiKey=';

var checkSignup = (username, phone, res) => {
  fetch(baseLink_verified + mongoDB_API_KEY)
    .then((response) => response.json())
      .then((responseData) => {
        var usernameFlag = false;
        var phoneFlag = false;
        for (var i = 0; i < responseData.length; i++) {
          if (responseData[i].username === username) {
            usernameFlag = true;
          }
          if (responseData[i].phone === phone) {
            phoneFlag = true;
          }
        }
        if (usernameFlag && phoneFlag) {
          res.sendStatus(400);
        } else if (usernameFlag) {
          res.sendStatus(401);
        } else if (phoneFlag) {
          res.sendStatus(402);
        } else {
          res.sendStatus(200);
          console.log('signup good to go');
        }
      });
}

var getUser = (username, password, res) => {
  fetch(baseLink_users + mongoDB_API_KEY)
    .then((response) => response.json())
      .then((responseData) => {
        var flag = false;
        var id, name, usernameFetched, passwordFetched, currentlocation, phone, code, verifiedPhone, image;
        for (var i = 0; i < responseData.length; i++) {
          if (responseData[i].username === username && responseData[i].password === password) {
            id = responseData[i]._id.$oid;
            name = responseData[i].name;
            usernameFetched = responseData[i].username;
            passwordFetched = responseData[i].password;
            currentlocation = responseData[i].currentlocation;
            phone = responseData[i].phone;
            code = responseData[i].verificationCode;
            verifiedPhone = responseData[i].verifiedPhone;
            image = responseData[i].image;
            flag = true;
            break;
          }
        }
        const returnObj = {
          id: id,
          name: name,
          username: usernameFetched,
          password: passwordFetched,
          phone: phone,
          currentlocation: currentlocation,
          verificationCode: code,
          verifiedPhone: verifiedPhone,
          image: image
        };
        if (flag) {
          res.status(200).send(returnObj);
        } else {
          res.sendStatus(402);
        }
      });
};

var createNewRoam = (username, userLat, userLong, transportation, radius, neighborhood) => {
  // console.log('making roam');
  var obj = {
    //we generate
    username1: username,
    username2: '',
    user1Longitude: userLong,
    user1Latitude: userLat,
    user1Transportation: transportation,
    date: '',
    user1TextCount: 3,
    user2TextCount: 3,
    //yelp generates for us
    venueLatitude: '',
    venueLongitude: '',
    address: '',
    venue: ''
  };

  var pickRandomCategory = () =>{
    var categories = ['bar', 'restaurant'];
    return categories[Math.floor(Math.random() * categories.length)];
  };
  //set limit: 1 so we only return back one search result
  //hardcode radius_filter for 2 miles
  //sample yelp api request looks like https://api.yelp.com/v2/search?term=german+food&location=Hayes&cll=37.77493,-122.419415

    var searchParams = {
      term: pickRandomCategory(),
      limit: 1,
      radius_filter: radius,
      cll: userLat + ',' + userLong,
      location: neighborhood
    };
    // console.log('params: ', searchParams);

    yelp.searchYelp(searchParams, function(venue) {
      
      obj.venue = venue.name;
      obj.address = venue.location.display_address.join(' ');
      obj.venueLongitude = venue.location.coordinate.longitude;
      obj.venueLatitude = venue.location.coordinate.latitude;
      //post to roam database all the details
      // console.log('yelp', obj);
      fetch(baseLink_roams + mongoDB_API_KEY,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      }).then(() => res.sendStatus(1999));
      //send back a confirmation response or not found
    });
};

module.exports = {
  
  signup: (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const phone = req.body.phone;
    const currentlocation = req.body.currentlocation;
    const verificationCode = req.body.verificationCode;
    const verifiedPhone = req.body.verifiedPhone;
    const image = req.body.image;

    const obj = {
      name: name,
      username: username,
      password: password,
      phone: phone,
      currentlocation: currentlocation,
      verificationCode: verificationCode,
      verifiedPhone: verifiedPhone,
      image: image
    };
    console.log('obj.......', obj);

    fetch(baseLink_verified + mongoDB_API_KEY)
      .then((response) => response.json())
        .then((responseData) => {
          var usernameFlag = false;
          var phoneFlag = false;
          console.log(responseData);
          for (var i = 0; i < responseData.length; i++) {
            if (responseData[i].username === username) {
              usernameFlag = true;
            }
            if (responseData[i].phone === phone) {
              console.log(responseData[i].phone, phone, '************');
              phoneFlag = true;
            }
          }
          if (usernameFlag && phoneFlag) {
            res.sendStatus(400);
          } else if (usernameFlag) {
            res.sendStatus(401);
          } else if (phoneFlag) {
            res.sendStatus(402);
          } else {
            fetch(baseLink_users + mongoDB_API_KEY,
            {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(obj)
            }).then((resp) => resp.json())
            .then((responseData) => res.status(200).send(responseData));//res.status(200).send(resp._bodyInit));
          }
        });
          
  },

  signin: (req, res) => {
    console.log('Logging in: ', req.body);
    const username = req.body.username;
    const password = req.body.password;
    getUser(username, password, res);
  },

  sendSMS: (req, res) => {
    var code = req.body.code;
    var phoneNumber = req.body.phoneNumber;
    var name = req.body.name;
    client.sendSms({
      to:'+1' + phoneNumber,
      from:'+19259058241',
      body:'Greetings ' + name + ', welcome to Roam!\n\nYour unique code: ' + code
    }, function(error, message) {
        if (!error) {
          console.log('Success! The code is:' + code);
          console.log('Message sent on:');
          console.log(message.dateCreated);
        } else {
          console.log('Oops! There was an error.');
        }
      });
  },

  checkCode: (req, res) => {
    var realCode = req.body.code;
    var inputCode = req.body.codeSubmitted;
    if (realCode === inputCode) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  },

  verifyUser: (req, res) => {
    var verifiedObj = {
      username: req.body.user.username,
      phone: req.body.user.phone,
    };

    fetch(baseLink_verified + mongoDB_API_KEY,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verifiedObj)
      }).then(res => res.json())
      .then(responseData => console.log(responseData));

    fetch(baseLink_users_query + req.body.id + '?apiKey=' + mongoDB_API_KEY,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
      body: JSON.stringify( { "$set" : {verifiedPhone: true}})
    });
  },

  isUserVerified: (req, res) => {
    console.log(req.body.id);
    fetch(baseLink_users_query + req.body.id + '?apiKey=' + mongoDB_API_KEY)
    .then((res) => res.json())
    .then((responseData) => {
      console.log(responseData);
      if(responseData.verifiedPhone) {
        res.sendStatus(200);
      } else {
        res.sendStatus(400);
      }
    });
  },

//MATCHING ALGORITHM
  roam: (req, res) => {
    var roamObj;
    var availableRoams = [];
    var username = req.body.id;
    var userLongitude = req.body.longitude;
    var userLatitude = req.body.latitude;
    var radius = req.body.radius;
    var transportation = req.body.transportation;
    var flag = false;
    console.log('this is transportation: >>>>>', transportation);
    //Search database for existing roams
    fetch(baseLink_roams + mongoDB_API_KEY)
    .then(response => response.json())
    .then(responseData => {
      // if no existing roams, create new roam
      if(responseData.length === 0) {
          console.log('https://maps.googleapis.com/maps/api/geocode/json?latlng='+ userLatitude + ',' + userLongitude + '&key=' + config.googleKey);
          fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + userLatitude + ',' + userLongitude + '&key=' + config.googleKey)
          .then((response) => response.json())
          .then((responseData) => {
            var neighborhood = responseData.results[0].address_components[2].long_name;
            createNewRoam(username, userLatitude, userLongitude, transportation, radius, neighborhood);
          }).catch(err=>console.log(err))
          // 400 means new room created, did not find a match
          .then(() => {res.sendStatus(400); return;});
      } else {
        //access the coordinates of existing roams
        //compare to current user's location to find roams within x mi radius
        for(var i=0; i<responseData.length; i++) {
          if(responseData[i].username1 === username || responseData[i].username2 === username) { res.sendStatus(401); return; }
          if(responseData[i].username2 !== '') { continue; }
          if (flag) {
            break;
          }
          var roamLat = responseData[i].venueLatitude;
          var roamLong = responseData[i].venueLongitude;
          var distance; 

          var origin = 'origins=' + userLatitude + ',' + userLongitude;
          var destination = '&destinations=' + roamLat + ',' + roamLong;
          var mode = '&mode=' + transportation;
          var saver = i;
          var googleMapsPath = googlemaps_API + origin + destination + mode + '&key=' + config.googleKey;
          fetch(googleMapsPath)
          .catch(err => console.log(err))
          .then( respons => respons.json())
          .then(responseData2 => {
            if(responseData2.rows[0].elements[0].distance.value < (radius + 2000)) {

              var user2TimeToDest = responseData2.rows[0].elements[0].duration.value;
              var origin = 'origins=' + responseData[saver].user1Latitude + ',' + responseData[saver].user1Longitude;
              var mode = '&mode=' + responseData[saver].user1Transportation;
                console.log('2');

              var googleMapsPath = googlemaps_API + origin + destination + mode + '&key=' + config.googleKey;
              fetch(googleMapsPath)
              .then(respons3 => respons3.json())
              .then( responseData3 => {
                var user1TimeToDest = responseData3.rows[0].elements[0].duration.value;
                var furtherPersonTime;
                if(user1TimeToDest > user2TimeToDest) {
                  furtherPersonTime = user1TimeToDest;
                } else {
                  furtherPersonTime = user2TimeToDest;
                };
                var timeToMeet = new Date();
                timeToMeet.setMinutes(timeToMeet.getMinutes() + 20);
                flag = true;
              fetch(baseLink_roams_query + responseData[saver]._id.$oid + '?apiKey=' + mongoDB_API_KEY,
              {
                method: 'PUT',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  },
                body: JSON.stringify( { "$set" : {username2: username, date: timeToMeet}})
              })
              .then( () => {
                flag = true;
                console.log('MATCHED');
                roamObj = responseData[saver];
              })
              .catch(err => console.log(err));
            })
           } 
          });
        }

        setTimeout(() => {
          if (!flag) {
            fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + userLatitude + ',' + userLongitude + '&key=' + config.googleKey)
              .then((response) => response.json())
              .then((responseData) => {
                var neighborhood = responseData.results[0].address_components[2].long_name;
                createNewRoam(username, userLatitude, userLongitude, transportation, radius, neighborhood);
              }).catch(err=>console.log(err))
              // 400 means new room created, did not find a match
              .then(() => res.sendStatus(400));
              console.log('made new thing');          
          } else {
            var roamId = roamObj._id.$oid;

            //make call to get roamObj -> currently undefined - I think its an asyn issue
            // fetch(baseLink_roams_query + roamId + '?apiKey=' + mongoDB_API_KEY)
            // .then(response => {response.json})
            // .then(function(roamObjJson) {
            //   var myRoamObj = roamObjJson;
            //   console.log('roamObj ======================== :', myRoamObj);
            // });


            // send text to first user to sign up for a roam
            // get user1's user info from roamObj
            var user1Id = roamObj.username1.toString();

            // use user1's id to search for user1's object in users collection
            fetch(baseLink_users_query + user1Id + '?apiKey=' + mongoDB_API_KEY)
            .then(data => data.json())
            .then(function(twilioObj) {
              var phoneNumber = twilioObj.phone;
              client.sendSms({
                  to:'+1' + phoneNumber,
                  from:'+19259058241',
                  body:'Hello there, you have a Roam at ' + roamObj.venue + ' at ' + 'roamObj.time' + ' with ' + 'roamObj.username2' + '.  The address is ' + roamObj.address + '.'
              }, function(error, message) {
                  if (!error) {
                      console.log('Success! The SID for this SMS message is:');
                      console.log(message.sid);
                      console.log('Message sent on:');
                      console.log(message.dateCreated);
                  } else {
                      console.log('Oops! There was an error.');
                  }
              });
            })
            res.sendStatus(200);
          }
        }, (500 * responseData.length));
      }
    });
  },

  cancelRoam: (req, res) => {
    fetch(baseLink_roams + mongoDB_API_KEY)
    .then(response => response.json())
    .then(responseData => {
      for(var i = 0; i < responseData.length; i++) {
        if (responseData[i].username1 === req.body.id || responseData[i].username2 === req.body.id) {
          fetch(baseLink_roams_query + responseData[i]._id.$oid + '?apiKey=' + mongoDB_API_KEY,
          {
            method: 'DELETE'
          }).then( () => res.send(200));
        }
      }
    });
  },

  populateHistory: (req, res) => {
    const userName = req.body.username;
    fetch(baseLink_history + mongoDB_API_KEY)
      .then((response) => response.json())
      .then((responseData) => {
        let returnArray = [];
        for (let i = 0; i < responseData.length; i++) {
          if (userName === responseData[i].username1 || userName === responseData[i].username2 ) {
            returnArray.push(responseData[i]);
          }
        }
        res.status(201).send(returnArray);
      })
      .catch((error) => {
        console.warn(error);
        res.sendStatus(400);
      });
  },

  isRoaming: (req, res) => {
    fetch(baseLink_roams + mongoDB_API_KEY)
    .then(res => res.json())
    .then(responseData => {
      var flag = false;
      var data;
      var roaming = false;
      responseData.forEach(entry => {
        if (entry.username1 === req.body.id || entry.username2 === req.body.id) {
          roaming = true;
        }
        if (entry.username1 === req.body.id || entry.username2 === req.body.id) {
          if (entry.username1 !== '' && entry.username2 !== '') {
            flag = true;
            data = entry;           
          }
        }
      });
      if (flag) {
        res.status(200).send(data);
      } 
      if (roaming) {
        res.sendStatus(300);
      }
      if (!roaming) {
        res.sendStatus(400);
      }
    });
  }, 

  getMatch: (req, res) => {
    var id = req.body.id;
    fetch(baseLink_users + mongoDB_API_KEY)
      .then((response) => response.json())
        .then((responseData) => {
          var flag = false;
          var idFetched, name, usernameFetched, passwordFetched, currentlocation, phone, code, verifiedPhone, image;
          for (var i = 0; i < responseData.length; i++) {
            if (responseData[i]._id.$oid === id) {
              console.log(responseData[i]._id.$oid, id, '**************');
              console.log('got it');
              idFetched = responseData[i]._id.$oid;
              name = responseData[i].name;
              usernameFetched = responseData[i].username;
              passwordFetched = responseData[i].password;
              currentlocation = responseData[i].currentlocation;
              phone = responseData[i].phone;
              code = responseData[i].verificationCode;
              verifiedPhone = responseData[i].verifiedPhone;
              image = responseData[i].image;
              flag = true;
              break;
            }
          }
          const returnObj = {
            id: idFetched,
            name: name || 'a new friend',
            username: usernameFetched,
            password: passwordFetched,
            phone: phone,
            currentlocation: currentlocation,
            verificationCode: code,
            verifiedPhone: verifiedPhone,
            image: image
          };
          console.log('!!!!', returnObj);
          if (flag) {
            res.status(201).send(returnObj);
          } else {
            res.sendStatus(402);
          }
        });
  },

  sendRoamText: (req, res) => {
    var phoneNumber = req.body.recipient.phone;
    console.log(req.body.user, req.body.roamData);
    client.sendSms({
      to:'+1' + phoneNumber,
      from:'+19259058241',
      body:'Matched buddy ' + req.body.user.name + ' says: ' + req.body.message
    }, function(error, message) {
        if (!error) {
          if (req.body.user.id === req.body.roamData.username1) {
            fetch(baseLink_roams_query + req.body.roamData._id.$oid + '?apiKey=' + mongoDB_API_KEY,
            {
              method: 'PUT',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
              body: JSON.stringify( { "$set" : {user1TextCount: req.body.roamData.user1TextCount-1} })
            });
          } else {
            fetch(baseLink_roams_query + req.body.roamData._id.$oid + '?apiKey=' + mongoDB_API_KEY,
            {
              method: 'PUT',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
              body: JSON.stringify( { "$set" : {user2TextCount: req.body.roamData.user2TextCount-1} })
            });
          }
          console.log('Message sent on:');
          console.log(message.dateCreated);
        } else {
          console.log('Oops! There was an error.');
        }
      });
  }

            // var obj = {
            // miles: responseData2.rows[0].elements[0].distance.text,
            // time: responseData2.rows[0].elements[0].duration.text,
            // };
            // console.log('****', obj);
            // if(!error && response.statusCode === 200) {
            //   distance = res.rows.elements[0].distance //always in meters
            // }

          //if it is within the radius, add it to an array
        //   if(distance <= radius) {
        //     availableRoams.push(response[i]);
        //   }
        // }
    //     var selectedRoam;
    //     //if no roams match radius requirement, create new roam
    //     if(availableRoams.length === 0) {
    //       createNewRoam()
    //     } else {
    //       selectedRoam = availableRoams[Math.floor(Math.random() * availableRoams.length)];
    //       selectedRoam.username2 = username;
    //       var timeToMeet = new Date();
    //       selectRoam.date = timeToMeet.setHours(timeToMeet.getHours() + 1);
    //     }
    //   }
    // }).then(res.status(200).send(selectedRoam));
  // }

};

    //if no roams are within the radius, create new roam
    //else randomly select from the list of roams and pair current user 

  //If no existing roams in db or no roams that match user's radius requirement, create new roam


  //Query database for current user's info (set usercurrentLocation with lat and long)
//   fetch(baseLink_users_query + req.body.id + '?apiKey=' + mongoDB_API_KEY)
//   .then((response) => response.json())
//   .then((responseData) => {
//     userCurrentlocation = {
//       longitude: responseData.longitude,
//       latitude: responseData.latitude
//     }
//   })
//   //Run through the list of users and find all the users that are within an x mile radius (pythagorean theorem?)
//   fetch(baseLink_users + mongoDB_API_KEY)
//   .then((response) => response.json())
//   .then((responseData) => {
//     var flag = false;
//     var id, name, usernameFetched, passwordFetched, currentlocation, phone;
//     for (var i = 0; i < responseData.length; i++) {
//       if (responseData[i].username === username && responseData[i].password === password) {
//         id = responseData[i]._id.$oid;
//         name = responseData[i].name;
//         usernameFetched = responseData[i].username;
//         passwordFetched = responseData[i].password;
//         currentlocation = responseData[i].currentlocation;
//         phone = responseData[i].phone;
//         flag = true;
//         break;
//       }
//     };
//   }),
  
// };

// amend old commit git

  //Page to set up event between users, making API calls to YELP
  // roam: (req, res) => {
  //   //if no match found create a pending roam node
  //   if (matchResults[0].data.length === 0) {
  //   console.log('nomatch');
  //     var searchParams = {
  //       term: 'Bars',
  //       limit: 20,
  //       sort: 0,
  //       radius_filter: 3200, //2-mile radius
  //       bounds: coords.maxLat + ',' + coords.minLong + '|' +  coords.minLat  + ',' + coords.maxLong
  //     };      

  //     //Creates the YELP object to make API request to yelp servers
  //     yelp.searchYelp(searchParams, function(venue) {
        
  //       var venueName = venue.name;
  //       var venueAddress = venue.location.display_address.join(' ');

  //       //Create a roam node if it doesn't exist
  //       apoc.query('CREATE (m:Roam {creatorEmail: "%userEmail%", creatorLatitude: %userLatitude%, creatorLongitude: %userLongitude%, creatorRoamStart: %startRoam%, creatorRoamEnd: %roamOffAfter%, status: "Pending", venueName: "%venueName%", venueAddress: "%venueAddress%"})', { email: userEmail, userEmail: userEmail, userLatitude: coords.userLatitude, userLongitude: coords.userLongitude,
  //     startRoam: times.startRoam, roamOffAfter: times.roamOffAfter, venueName: venueName, venueAddress: venueAddress }).exec().then(function(queryRes) {

  //         // creates the relationship between creator of roam node and the roam node
  //         apoc.query('MATCH (n:User {email:"%email%"}), (m:Roam {creatorEmail: "%creatorEmail%", creatorRoamStart: %roamStart%}) CREATE (n)-[:CREATED]->(m)', {email:userEmail, creatorEmail: userEmail, roamStart: times.startRoam} ).exec().then(function(relationshipRes) {
  //            console.log('Relationship created', relationshipRes); 
  //         });
  //       });
  //     });
  //   } else { //Roam node found within a similar geographic location
  //     console.log('Found a match', matchResults[0].data[0].meta[0].id);

  //     var id = matchResults[0].data[0].meta[0].id;

  //     //Grabs roam node between similar location, and creates the relationship between node and user
  //     apoc.query('MATCH (n:User {email:"%email%"}), (m:Roam) WHERE id(m) = %id% SET m.status="Active" CREATE (n)-[:CREATED]->(m) RETURN m', {email:userEmail, id:id} ).exec().then(function(roamRes) {
  //         console.log('Relationship created b/w Users created', roamRes[0].data[0].row[0]);
  //         var roamInfo = roamRes[0].data[0].row[0];

  //         var date = formattedDateHtml();

  //         //Generates an automatic email message
  //         var mailOptions = {
  //           from: '"Roam" <Roamincenterprises@gmail.com>', // sender address 
  //           bcc: roamInfo.creatorEmail + ',' + userEmail, // List of users who are matched
  //           subject: 'Your Roam is Ready!', // Subject line 
  //           text: 'Your Roam is at:' + roamInfo.venueName + ' Roam Address: ' + roamInfo.venueAddress, // plaintext body 
  //           html: generateEmail(roamInfo.venueName, roamInfo.venueAddress, date) // html body 
  //         };
           
  //         // send mail with defined transport object 
  //         transporter.sendMail(mailOptions, function(error, info){
  //           if(error){
  //             return console.log(error);
  //           }
  //           console.log('Message sent: ' + info.response);
  //         });

  //         res.send("You have been matched"); 
  //       });
  //     }
  // },