import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  NavigatorIOS,
  View
} from 'react-native';

var Login = require('./App/Components/Login');
var User = require('./App/Components/User');
var GeolocationView = require('./App/Components/Geolocation.js');
var Time = require('./App/Components/Time.js');
var Splash = require('./App/Components/Splash.js');
var VerifyText = require('./App/Components/VerifyText.js');
var CurrentRoam = require('./App/Components/CurrentRoam.js');
var Signup = require('./App/Components/Signup.js');
var Confirmation = require('./App/Components/Confirmation.js');
var tabs = require('./App/Components/TabBar.js');

class roam extends Component{
  render() {
    return (
      <NavigatorIOS
      style={styles.container}
        initialRoute={{
          title: 'Login',
          component: Login,
          //passProps: {user: {id: '5758a1abc2ef1652b41f961f'}}
        }}
        navigationBarHidden={true} />
    );
  }
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'red'
  },
});

AppRegistry.registerComponent('roam', () => roam);
