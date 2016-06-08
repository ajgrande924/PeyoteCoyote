import React, { Component } from 'react';
import { SegmentedControls } from 'react-native-radio-buttons';
var Confirmation = require('./Confirmation');
var Separator = require('./Helpers/Separator');

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
  MapView,
  Dimensions
} from 'react-native';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class Time extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: '1 hour',
      user: props.user,
      navigator: props.navigator
    };
  }
  handleSelected(choice) {
    this.setState({
      selectedOption: choice
    });
  }

  handleSubmit() {
    console.log('Sending ROAM request!', coordinates);
    this.props.navigator.push({
      title: 'Confirmation',
      component: Confirmation,
      user: this.state.user
    });
  }

  render () {
    const options = [
      '1 hour',
      '2 hours',
      '4 hours',
      'Anytime'
    ];
    return (
      <Image style={styles.backgroundImage}
      source={require('../../imgs/uni.jpg')} >
        
        <View style={styles.userContainer}>
        <View style={styles.profileContainer}>
          <Image style={styles.image}
          source={require('../../imgs/uni.jpg')} />
        </View>
        <View style={styles.statsContainer}>
        </View> 
        </View>
        
        <SegmentedControls
          tint={'#ff0066'}
          selectedTint={'white'}
          backTint={'white'}
          options={options}
          allowFontScaling={false}
          fontWeight={'bold'}
          onSelection={this.handleSelected.bind(this)}
          selectedOption={this.state.selectedOption} />
        <Geolocation region={this.props.region}/>
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)} >
            <Text style={styles.buttonText}> Roam! </Text>
        </TouchableHighlight>
      </Image>
    );
  }
}


class Geolocation extends Component {
    constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
    };
  }

  componentDidMount() {             
  }

  render() {
    return (
      <View>
        <MapView
        showsUserLocation={true}
        style={styles.map}
        region={this.state.region}
        followUserLocation={true} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userContainer: {
    width: deviceWidth,
    height: deviceHeight/4,
    borderColor: 'white',
    borderWidth: 4
  },
  profileContainer: {
    width: deviceWidth,
    height: deviceHeight/8,
    borderColor: 'white',
    borderWidth: 4,
    alignItems: 'center'
  },
  image: {
    height: deviceWidth/5,
    width: deviceWidth/5,
    borderRadius: 40,
    borderColor: 'white',
    borderWidth: 4
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: deviceHeight/15,
    width: deviceWidth,
    flexDirection: 'row',
    backgroundColor: '#ff0066',
    // borderRadius:10,
    marginBottom: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  unselected: {
    fontSize: 20,
    backgroundColor: 'orange',
    marginTop: 20,
    marginBottom: 20,
    borderColor: 'black',
    padding: 10,
    textAlign: 'center',
    justifyContent: 'center'
  },
  selected: {
    fontSize: 20,
    backgroundColor: 'green',
    marginTop: 20,
    marginBottom: 20,
    borderColor: 'black',
    padding: 10,
    textAlign: 'center',
    justifyContent: 'center'
  },
  backgroundImage: {
    flex:1,
    width:null,
    height: null,
    // marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  location: {
    backgroundColor: 'transparent',
    fontSize: 25,
    color: 'white',
    textAlign: 'center'
  },
  map: {
    height: deviceHeight/2,
    width: deviceWidth,
    // margin: 10,
    // borderWidth: 1,
    // borderColor: '#000000',
    backgroundColor: 'transparent'
  },
});




module.exports = Time;