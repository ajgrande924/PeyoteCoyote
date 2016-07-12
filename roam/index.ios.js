import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
} from 'react-native';

const Login = require('./App/Components/Login');
const User = require('./App/Components/User');
const Time = require('./App/Components/Time.js');
const Splash = require('./App/Components/Splash.js');
const VerifyText = require('./App/Components/VerifyText.js');
const CurrentRoam = require('./App/Components/CurrentRoam.js');
const Signup = require('./App/Components/Signup.js');
const MatchView = require('./App/Components/Match.js');
const tabs = require('./App/Components/TabBar.js');
const PendingRoam = require('./App/Components/PendingRoam.js');

class roam extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Login',
          component: Login,
          //passProps: {user: {id: '5758a1abc2ef1652b41f961f'}}
        }}
        navigationBarHidden={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});

AppRegistry.registerComponent('roam', () => roam);
