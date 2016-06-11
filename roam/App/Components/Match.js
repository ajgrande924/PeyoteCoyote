import React, { Component } from 'react';
import { SegmentedControls } from 'react-native-radio-buttons';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';

// console.disableYellowBox = true;

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
    var date = new Date(props.currentRoam.date);
    var hours = date.getHours();
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var TofD = hours > 12 ? 'PM' : 'AM';
    hours = TofD === 'PM' ? hours-12 : hours;
    var meetupTime = hours + ":" + minutes + TofD;
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
      match: {name: 'a New Friend'},
      textsRemaining: 0,
      stateChange: props.passedDownStateChange,
      date: meetupTime
    };

    this.getTextCountRemaining();
  }

  getTextCountRemaining() {
    if (this.state.currentRoam.username1 === this.state.user.id) {
      this.state.textsRemaining = this.state.currentRoam.user1TextCount;
    } else {
      this.state.textsRemaining = this.state.currentRoam.user2TextCount;
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: (position.coords.latitude+this.state.currentRoam.venueLatitude)/2,
            longitude: (position.coords.longitude+this.state.currentRoam.venueLongitude)/2,
            latitudeDelta: Math.abs(position.coords.latitude - this.state.currentRoam.venueLatitude) * 2,
            longitudeDelta: Math.abs(position.coords.longitude - this.state.currentRoam.venueLongitude) * 2
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
        this.getMatch();
      });
  }

  getMatch() {
    var id;
    if (this.state.user.id === this.state.currentRoam.username1) {
      id = this.state.currentRoam.username2;
    } else {
      id = this.state.currentRoam.username1;
    }
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
        // console.error(response._bodyInit);
        this.setState({
          match: JSON.parse(response._bodyInit),
          // response: false,
        });
      }
    })
    .catch((error) => {
      console.warn(error);
    });
  }

  cancelMatch() {
    fetch('http://localhost:3000/cancelRoam', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: this.state.user.id})
    })
    .then((res) => {
      this.state.stateChange(1);
    })
    .catch((error) => {
      console.log('Error handling submit:', error);
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

  sendText() {
    const name = this.state.match.name;
    if (this.state.textsRemaining > 0) {
    AlertIOS.prompt(
      'Text to ' + name,
      this.state.textsRemaining + ' Texts Remaining',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Send', onPress: message => {
          fetch('http://localhost:3000/sendRoamMsg',
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({user: this.state.user, message: message, recipient: this.state.match, roamData: this.state.currentRoam})
          });
          this.setState({textsRemaining: this.state.textsRemaining-1});
          AlertIOS.alert('Sent!');
        }},
      ]
    );
    } else {
      AlertIOS.alert('You have no complimentary texts remaining! ;__;');
    }
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
        <Text style={styles.matchMessage}>Congratulations! You and {this.state.match.name} are ready to Roam!</Text>
        <View style={styles.profileContainer}>
          <View style={styles.titles}>
            <Image style={styles.circleImage} source={{uri: this.state.user.image}}/> 
            <Text style={styles.navTitle}>{this.state.user.name}</Text>
          </View>
          <View style={styles.titles}>
            <Image style={styles.circleImage} source={{uri: this.state.match.image}}/> 
            <Text style={styles.navTitle}>{this.state.match.name}</Text>
          </View>
        </View>

      </View>
      <Geolocation date={this.state.date} currentRoam={this.state.currentRoam} stateChange={this.passedDownStateChange.bind(this)} navigator={this.state.navigator} user={this.state.user} region={this.state.region} markers={this.state.markers} coordinate={this.state.coordinate}/>
      <View style={styles.buttons}>
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            onPress={this.cancelMatch.bind(this)}
            style={styles.button}
            underlayColor="white" >
              <Text style={styles.buttonText}>Cancel Roam</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            onPress={this.sendText.bind(this)}
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
      date: props.date,
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
          <Text style={styles.addressDescription}>Meetup Time: {this.state.date}</Text>
        </View>
        <View style={styles.mapContainer}>
          <View>
            <MapView 
            style={styles.map}
            initialRegion={this.state.region}>
              <MapView.Marker
                pinColor={'teal'}
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