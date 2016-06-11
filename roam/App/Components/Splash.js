import React, { Component } from 'react';
import { SegmentedControls } from 'react-native-radio-buttons';
var Separator = require('./Helpers/Separator');
var styles = require('./Helpers/styles');

var coordinates = {};

import {
  Animated,
  Image,
  View,
  Text,
  StyleSheet,
  TextInput,
  ListView,
  TouchableHighlight,
  ActivityIndicatorIOS,
  MapView
} from 'react-native';

var flag = false;

class Splash extends Component {
    constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      fadeAnim: new Animated.Value(0), /////////////////////////////////
      alternate: false
    };
  }

  componentDidMount () {
      console.log('Hello From Geolocation')
      if (!navigator.geolocation) {console.log('geoloaction not available')};
      if (navigator.geolocation) {console.log('geoloaction available')};
      navigator.geolocation.getCurrentPosition(
        (initialPosition) => {
         console.log(initialPosition);
          this.setState({initialPosition});
        },
        (error) => alert(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );

      this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
        coordinates = lastPosition;
        console.log(lastPosition);
        this.setState({latitude: lastPosition.coords.latitude});
        this.setState({latitude: lastPosition.coords.latitude});

        var newRegion = {
          latitude: lastPosition.coords.latitude,
          longitude: lastPosition.coords.longitude,
          latitudeDelta: 10,
          longitudeDelta: 10
        }

        this.setState({ region: newRegion });

        this.setState({ annotations: [{
          latitude: lastPosition.coords.latitude,
          longitude: lastPosition.coords.longitude,
          title: 'Current Location',
          subtitle: 'This is your current location'
        }]});
      });
    }

    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
    }

componentDidMount() {
  this.determineFadingAction();
  setInterval( () => {
    this.determineFadingAction();
  },5000);              
}

determineFadingAction() {
  if (!flag){
    Animated.timing(          
      this.state.fadeAnim,    
      {
        toValue: 1,
        duration:6000
      }
    ).start();
    flag = !flag;   
  } else {
    Animated.timing(          
    this.state.fadeAnim,    
      {
        toValue: 0,
        duration:6000
      }
    ).start();
    flag = !flag;
  }
}



  render() {
    return (      
      <View style={{flex:1}}>
        <Animated.Image source={require('./Images/a.jpg')} style={{width:320,height:320,resizeMode:'cover',position:'absolute'}}  />
        <Animated.Image source={require('./Images/b.jpg')} style={{width:320,height:320,resizeMode:'cover',opacity:this.state.fadeAnim}}  />
      </View>)
  }
}

module.exports = Splash;