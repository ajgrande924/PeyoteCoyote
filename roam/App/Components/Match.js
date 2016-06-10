import React, { Component } from 'react';
import { SegmentedControls } from 'react-native-radio-buttons';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';

// console.disableYellowBox = true;

const currentRoam = {
  "_id": {
      "$oid": "575afc63bd966f7076198920"
  },
  "username1": "5758a1abc2ef1652b41f961f",
  "username2": "575a3138c2ef166e0a29e40c",
  "user1Longitude": -122.02980523,
  "user1Latitude": 37.33068623,
  "user1Transportation": "walking",
  "date": "2016-06-10T18:04:31.294Z",
  "venueLatitude": 37.3236351013184,
  "venueLongitude": -122.040130615234,
  "address": "20955 Stevens Creek Blvd Cupertino, CA 95014",
  "venue": "Brew Hub"
}

import {
  Animated,
  Image,
  AlertIOS,
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

class MatchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      navigator: props.navigator,
      region: {},
      markers: [],
      coordinate: {},
      refresh: true,
      currentView: 1,
      currentRoam: props.currentRoam,
      match: props.user,
    };

  }

  componentDidMount() {
    // this.getMatch();
    // console.error(this.state.currentRoam);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: Math.abs(position.coords.latitude - this.state.currentRoam.venueLatitude) * 4,
            longitudeDelta: Math.abs(position.coords.longitude - this.state.currentRoam.venueLongitude) * 4
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
    this.getMatch();
  }

  getMatch() {
    var id;
    if (this.user.id === this.state.currentRoam.username1) {
      id = this.state.currentRoam.username2;
    } else {
      id = this.state.currentRoam.username1;
    }
    console.error(id);
    const obj = {
      id: id,
    };
    fetch('http://localhost:3000/match', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
    .then((response) => {
      if (response.status === 201) {
        this.setState({
          match: JSON.parse(response._bodyInit),
        });
      }
    })
    .catch((error) => {
      console.warn(error);
    });
  }

  passedDownStateChange(value) {
    this.setState({
      currentView: value,
      refresh: true
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

  render () {
    if (this.state.refresh) {
      return this.loadingPage();
    }
    return (
      <Image style={styles.backgroundImage}
      source={require('../../imgs/uni.jpg')} >

      <View style={styles.navbarContainer}>
        <Text style={styles.matchTitle}> It's a Match! </Text>
        <Text style={styles.matchMessage}>Congratulations! You and {this.state.match.username} are ready to Roam!</Text>
        <View style={styles.profileContainer}>
          <View style={styles.titles}>
            <Image style={styles.circleImage} source={{uri: this.state.user.image}}/> 
            <Text style={styles.navTitle}>{this.state.user.username}</Text>
          </View>
          <View style={styles.titles}>
            <Image style={styles.circleImage} source={{uri: this.state.match.image}}/> 
            <Text style={styles.navTitle}>{this.state.match.username}</Text>
          </View>
        </View>

      </View>
      <Geolocation currentRoam={this.state.currentRoam} stateChange={this.passedDownStateChange.bind(this)} navigator={this.state.navigator} user={this.state.user} region={this.state.region} markers={this.state.markers} coordinate={this.state.coordinate}/>
      <View style={styles.buttons}>
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={styles.button}
            underlayColor="white" >
              <Text style={styles.buttonText}>Cancel Roam</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={styles.button}
            underlayColor="white" >
              <Text style={styles.buttonText}>Text</Text>
          </TouchableHighlight>
        </View>
      </View>
      </Image>
    );
  }
}


class Geolocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      currentRoam: props.currentRoam,
      navigator: props.navigator,
      sendState: props.stateChange,
      region: props.region,
      marker: {
        coordinates: {
          latitude: props.markers[0].latitude,
          longitude: props.markers[0].longitude,
        },
        title: 'Hello',
        description: 'this is my current location',
      },
    };    
  }


  render() {
    return (
      <View>
        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>{this.state.currentRoam.venue}</Text>
          <Text style={styles.addressDescription}>{this.state.currentRoam.address}</Text>
          <Text style={styles.addressDescription}>Meetup Time: {this.state.currentRoam.date}</Text>
        </View>
        <View style={styles.mapContainer}>
          <View>
            <MapView 
            style={styles.map}
            initialRegion={this.state.region}>
              <MapView.Marker
                coordinate={this.state.marker.coordinates}
                title={this.state.marker.title}
                description={this.state.marker.description}
              />
              <MapView.Marker
                coordinate={{ latitude: this.state.currentRoam.venueLatitude, longitude: this.state.currentRoam.venueLongitude}}
                title={this.state.currentRoam.venue}
                description={this.state.currentRoam.address}
              />
            </MapView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navbarContainer:{
    marginTop: deviceHeight/40,
    backgroundColor: 'transparent',
    paddingTop: deviceHeight/25,
    height: deviceHeight/3,
    // borderBottomColor: 'white',
    // borderBottomWidth: 2
  },
  matchTitle: {
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 45,
    fontFamily: 'Avenir',
    marginRight: deviceWidth/40
  },
  matchMessage: {
    color:'#fff',
    textAlign:'center',
    fontSize: 10,
    fontFamily: 'Avenir',
    marginRight: deviceWidth/40
  },
  navTitle: {
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 17,
    fontFamily: 'Avenir',
    marginRight: deviceWidth/40
  },
  profileContainer: {
    height: deviceHeight/6,
    width: deviceWidth,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row' 
  },
  statsContainer: {
    height: deviceHeight/9,
    width: deviceWidth,
    flexDirection: 'row'
  },
  titles: {
    width: deviceWidth/3,
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: deviceHeight/40,
    // borderColor: 'white', 
    // borderWidth: 1,
  },
  circleImage: {
    height: deviceWidth/5,
    borderRadius: deviceWidth/10,
    width: deviceWidth/5,
    borderColor: 'white',
    borderWidth: 1.5
  },
  buttons: {
    flexDirection: 'row',
    width: deviceWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: deviceHeight/80,
    width: deviceWidth/2.8,
    alignItems: 'center', 
    justifyContent: 'center',
    // borderColor: 'white', 
    // borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: deviceHeight/20,
    width: deviceWidth/3.4,
    flexDirection: 'row',
    backgroundColor: '#ff0066',
    // borderRadius:10,
    marginBottom: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex:1,
    width:null,
    height: null,
    // marginTop: 20,
    flexDirection: 'column',
    // justifyContent: 'center'
  },
  addressContainer: {
    width: deviceWidth,
    height: deviceWidth/7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: deviceHeight/80, 
    // borderColor: 'white',
    // borderWidth: 1,
  },
  addressTitle: {
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 17,
    fontFamily: 'Avenir',
    marginRight: deviceWidth/40
  },
  addressDescription: {
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 12,
    fontFamily: 'Avenir',
    marginRight: deviceWidth/40
  },
  mapContainer: {
    width: deviceWidth,
    height: deviceWidth/1.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    height: deviceWidth/1.4,
    width: deviceWidth/1.4,
    backgroundColor: 'transparent',
  },
});

module.exports = MatchView;