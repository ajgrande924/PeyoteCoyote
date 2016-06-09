import React, { Component } from 'react';
import { SegmentedControls } from 'react-native-radio-buttons';
import MapView from 'react-native-maps';

var Confirmation = require('./Confirmation');
var Separator = require('./Helpers/Separator');

console.disableYellowBox = true;

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
  Dimensions,
  Slider
} from 'react-native';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class Time extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 'Walk',
      user: props.user,
      navigator: props.navigator,
      region: {},
      markers: [],
      coordinate: {},
      refresh: true
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          },
          markers: [{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }],
          coodinate: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          refresh: false
        });
      });
  }

  loadingPage() {
    return(
      <View></View>
      );
  }

  handleSelected(choice) {
    this.setState({
      selectedOption: choice
    });
  }

  handleSubmit() {
    // fetch('http://localhost:3000/initiateRoam',
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify()
    //   });
    this.props.navigator.push({
      title: 'Confirmation',
      component: Confirmation,
      user: this.state.user
    });
  }

  render () {
    if (this.state.refresh) {
      return this.loadingPage();
    }
    const options = [
      'Walk',
      'Drive',
    ];
    return (
      <Image style={styles.backgroundImage}
      source={require('../../imgs/uni.jpg')} >

      <View style={styles.navbarContainer}>
        <View style={styles.profileContainer}>
          <View>
            <Image style={styles.circleImage} source={{uri: 'http://liketherazor.com/wp-content/uploads/2014/12/13-Chris-Gillett-Houston-Headshot-Photographer-Brenna-Smith-1024x732.jpg'}}/> 
          </View>
          <View style={styles.titles}>
            <Text style={styles.navTitle}>jjones</Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.stat}>18</Text>
            <Text style={styles.statTitle}>Roams</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.stat}>8.5</Text>
            <Text style={styles.statTitle}>Rating</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.stat}>18</Text>
            <Text style={styles.statTitle}>Roams</Text>
          </View>
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
        <Geolocation region={this.state.region} markers={this.state.markers} coordinate={this.state.coordinate}/>
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
      region: props.region,
      marker: {
        coordinates: {
          latitude: props.markers.latitude,
          longitude: props.markers.longitude,
        },
        title: 'Hello',
        description: 'this is a nice spot',
      },
      circleRadius: 1609.34,
      refresh: true,
      coordinate: props.coordinate,
      selectedOption: '1 Mile'
    };
  }

  loadingPage() {
    this.setState({refresh: false});
    return(
      <View></View>
      );
  }

  handleSelected(choice) {
    let value;
    const mile = 1609.34;
    if (choice === '0.5 Miles') {
      value = mile/2;
    }
    if (choice === '1 Mile') {
      value = mile;
    }
    if (choice === '1.5 Miles') {
      value = mile + (mile/2);
    }
    if (choice === '2 Miles') {
      value = 2 * mile;
    }
    this.setState({
      selectedOption: choice,
      circleRadius: value,
      refresh: true
    });
  }

  handleDriveSelected(choice) {
    let value;
    const mile = 1609.34;
    if (choice === '5 Miles') {
      value = mile * 5;
    }
    if (choice === '10 Mile') {
      value = mile * 10;
    }
    if (choice === '15 Miles') {
      value = mile * 15;
    }
    if (choice === '20 Miles') {
      value = miles * 20;
    }
    this.setState({
      selectedOption: choice,
      circleRadius: value,
      refresh: true,
    });
  }

  render() {
    if (this.state.refresh) {
      return this.loadingPage();
    } else {
    const options = [
      '0.5 Miles',
      '1 Mile',
      '1.5 Miles',
      '2 Miles'
    ];
    return (
      <View>
        <View style={styles.sliderContainer}>
            <SegmentedControls
              tint={'#ff0066'}
              selectedTint={'white'}
              backTint={'white'}
              options={options}
              allowFontScaling={false}
              fontWeight={'bold'}
              onSelection={this.handleSelected.bind(this)}
              selectedOption={this.state.selectedOption} />
        </View>
        <MapView 
        style={styles.map}
        initialRegion={this.state.region}>
          <MapView.Marker
            coordinate={this.state.marker.coordinates}
            title={this.state.marker.title}
            description={this.state.marker.description}
          />
          <MapView.Circle
            center={this.state.marker.coordinates}
            radius={this.state.circleRadius}
            fillColor="rgba(200, 0, 0, 0.5)"
            strokeColor="rgba(0,0,0,0.5)"/>
          <MapView.Marker
            coordinate={this.state.coordinate}/>
        </MapView>
      </View>
    );
  }
  }
}

const styles = StyleSheet.create({
  navbarContainer:{
    backgroundColor: 'transparent',
    paddingTop: deviceHeight/25,
    height: deviceHeight/3,
    borderBottomColor: 'white',
    // borderWidth: 2
  },
  navTitle: {
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 20,
    fontFamily: 'Avenir',
    marginRight: deviceWidth/40
  },
  profileContainer: {
    height: deviceHeight/6,
    width: deviceWidth,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  statsContainer: {
    height: deviceHeight/9,
    width: deviceWidth,
    flexDirection: 'row'
  },
  statBox: {
    width: deviceWidth/3,
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'center'
  },
  stat: {
    fontSize: 25,
    color: 'white',
  },
  statTitle: {
    fontSize: 10,
    color: '#ff0066',
  },
  titles: {
    flexDirection: 'row',
  },
  circleImage: {
    height: deviceWidth/5,
    borderRadius: deviceWidth/10,
    width: deviceWidth/5,
    borderColor: 'white',
    borderWidth: 1.5
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
    height: deviceHeight/3,
    width: deviceWidth,
    backgroundColor: 'transparent'
  },
});




module.exports = Time;