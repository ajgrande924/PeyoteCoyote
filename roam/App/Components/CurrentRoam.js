import React, { Component } from 'react';

// Require authentication component
const styles = require('./Helpers/styles');
const TabBar = require('./TabBar.js');

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

import {
  ActivityIndicatorIOS,
  AlertIOS,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';


class RoamView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isLoading: false,
      error: false,
      errorMessage: '',
      buddy: 'Ben',
      destination: 'Sonoma',
      address: '4263 Market Street',
      meetupTime: '6:00 PM'  
    };
  }

  handleUberClick() {
    AlertIOS.alert(
      'Uber\'s been ordered for ' + this.state.destination + '!'
    );
  }
  
  render() {
    var showErr = (
      this.state.error ? <Text style={styles.errorMessage}> {this.state.errorMessage} </Text> : <View></View>
    );
    return(
      <Image style={styles.backgroundImage}
        source={require('../../imgs/uni.jpg')}>
        <Text style={styles.title}> Match! </Text>
        <Text style={[styles.subTitle, styles.boldify]}> { this.state.destination }</Text>
        <Text style={[styles.subTitle, styles.boldify]}> { this.state.address }</Text>
        <Text style={styles.subTitle}>Buddy: { this.state.buddy }</Text>
        <Text style={styles.subTitle}>Meetup Time: <Text style={styles.boldify}>{ this.state.meetupTime }</Text></Text>
        <Geolocation />
        <TouchableHighlight
          onPress={this.handleUberClick.bind(this)}
          underlayColor="transparent" >
            <Image style={[styles.button, buttonStyles.button]} source={require('../../imgs/UberButton.png')}></Image>
        </TouchableHighlight>
        {/* This is the loading animation when isLoading is set to true */}
        <ActivityIndicatorIOS
          animating={this.state.isLoading}
          color="#111"
          size="large"></ActivityIndicatorIOS>
        {showErr}
      </Image>
    );
  }
}

const buttonStyles = StyleSheet.create({
  button: {
    width: deviceWidth / 1.8,
    backgroundColor: 'transparent',
  },
});

module.exports = RoamView;
