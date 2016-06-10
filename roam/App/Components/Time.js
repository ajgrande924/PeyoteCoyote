import React, { Component } from 'react';
import { SegmentedControls } from 'react-native-radio-buttons';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActivityPicker from './PickActivity.js';

var Geolocation = require('./Geolocation.js');
var stylesFile = require('./Helpers/styles');
var Confirmation = require('./Confirmation');
var Separator = require('./Helpers/Separator');
console.disableYellowBox = true;

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

class RoamView extends Component {
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
      initialLoad: false,
      roamingData: {}
    };

  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04
          },
          markers: [{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }],
          coodinate: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          refresh: false,
          initialLoad: true,
        });
      });
    fetch('http://localhost:3000/isRoaming', 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: this.state.user.id})
    })
    .then(res => {
      if (res.status === 200) {
        this.setState({
          roamingData: JSON.parse(res._bodyInit),
          currentView: 3
        });
      }
      if (res.status === 300) {
        this.setState({
          currentView: 2
        });
      }
      if (res.status === 400) {
        this.setState({
          currentView: 1
        });
      }
    });
  }

  passedDownStateChange(value) {
    this.state.currentView = value;
    this.setState({
      refresh: true
    });
  }

  handleSelected(choice) {
    this.setState({
      selectedOption: choice
    });
  }

  renderLoadingPage() {
    if (this.state.initialLoad === true) {
      setTimeout(() => this.setState({refresh: false}), 0);
    }
    return(
      <View></View>
      );
  }

  renderSearchView() {
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
        <RoamSearchView stateChange={this.passedDownStateChange.bind(this)} navigator={this.state.navigator} user={this.state.user} region={this.state.region} markers={this.state.markers} coordinate={this.state.coordinate}/>
      </Image>
    );
  }

  render () {

    if (this.state.refresh) {
      return this.renderLoadingPage();
    }
    if (this.state.currentView === 1) {
      return this.renderSearchView();
    }
    if (this.state.currentView === 2) {
      return (<PendingRoam user={this.state.user} passedDownStateChange={this.passedDownStateChange.bind(this)} />);
    }

    if (this.state.currentView === 3) {
      return (<MatchedView user={this.state.user} data={this.state.roamingData} passedDownStateChange={this.passedDownStateChange.bind(this)} />);
    }
    
  }
}

class RoamSearchView extends Component {
    
  constructor(props) {
  super(props);
  this.state = {
    user: props.user,
    navigator: props.navigator,
    sendState: props.stateChange,
    region: props.region,
    marker: {
      coordinates: {
        latitude: props.markers[0].latitude,
        longitude: props.markers[0].longitude,
      },
      title: 'Hello',
      description: 'this is a nice spot',
    },
    circleRadius: 1609.34,
    refresh: true,
    coordinate: props.coordinate,
    transportSelectedOption: 'Walk',
    selectedOption: '0.5 Miles',
    driveSelectedOption: '5 Miles',
    transportOptions: [
      'Walk',
      'Drive',
    ],
    walkOptions: [
      '0.5 Miles',
      '1 Mile',
      '1.5 Miles',
      '2 Miles'
    ],
    driveOptions: [
      '5 Miles',
      '10 Miles',
      '15 Miles',
      '20 Miles',
    ] 
  };
  
  }

  handleSubmit() {
    if(this.state.transportSelectedOption === 'Walk') {
      this.state.transportSelectedOption = 'walking';
    } else {
      this.state.transportSelectedOption = 'driving';
    }
    var userObj = {
      id: this.state.user.id,
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
      radius: Math.floor(this.state.circleRadius),
      transportation: this.state.transportSelectedOption
    };
    fetch('http://localhost:3000/roam',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userObj)
      })
    .then( response => {
      if(response.status === 400) {
        AlertIOS.alert('searching for match');
        this.state.sendState(2);
      } else if (response.status === 200){
        AlertIOS.alert('going to match view!');
        this.state.sendState(3);
        
      } else if (response.status === 401) {
        AlertIOS.alert('match in progress! going to match view!');
        this.state.sendState(3);
      }
    });
  }

  loadingPage() {
    this.setState({refresh: false});
    return(
      <View></View>
      );
  }

  handleTransportSelected(choice) {
    let value;
    if (choice === 'Walk') {
      value = 1609.34/2;
      this.setState({
        transportSelectedOption: choice,
        selectedOption: '0.5 Miles',
        circleRadius: value,
        refresh: true,
        region: {
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
          latitudeDelta: 0.04 * value/1609.34,
          longitudeDelta: 0.04 * value/1609.34,
        },
      });
    } else {
      value = 1609.34 * 5;
      this.setState({
        transportSelectedOption: choice,
        driveSelectedOption: '5 Miles',
        circleRadius: value,
        refresh: true,
        region: {
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
          latitudeDelta: 0.04 * value/1609.34,
          longitudeDelta: 0.04 * value/1609.34,
        },
      });
    }

  }

  renderDistanceSegment() {
    if (this.state.transportSelectedOption === 'Walk') {
      return (
        <View>
        <SegmentedControls
          tint={'#ff0066'}
          selectedTint={'white'}
          backTint={'white'}
          options={this.state.walkOptions}
          allowFontScaling={false}
          fontWeight={'bold'}
          onSelection={this.handleSelected.bind(this)}
          selectedOption={this.state.selectedOption}/>
        </View>
      )
    } else {
      return (
        <SegmentedControls
          tint={'#ff0066'}
          selectedTint={'white'}
          backTint={'white'}
          options={this.state.driveOptions}
          allowFontScaling={false}
          fontWeight={'bold'}
          onSelection={this.handleDriveSelected.bind(this)}
          selectedOption={this.state.driveSelectedOption} />
      )
    }
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
      refresh: true,
      region: {
        latitude: this.state.region.latitude,
        longitude: this.state.region.longitude,
        latitudeDelta: 0.04 * value/1609.34,
        longitudeDelta: 0.04 * value/1609.34,
      },
    });
  }

  handleDriveSelected(choice) {
    let value;
    const mile = 1609.34;
    if (choice === '5 Miles') {
      value = mile * 5;
    }
    if (choice === '10 Miles') {
      value = mile * 10;
    }
    if (choice === '15 Miles') {
      value = mile * 15;
    }
    if (choice === '20 Miles') {
      value = mile * 20;
    }
    this.setState({
      driveSelectedOption: choice,
      circleRadius: value,
      refresh: true,
      region: {
        latitude: this.state.region.latitude,
        longitude: this.state.region.longitude,
        latitudeDelta: 0.04 * value/1609.34,
        longitudeDelta: 0.04 * value/1609.34,
      },
    });
  }

  render() {
    if (this.state.refresh) {
      return this.loadingPage();
    } else {

    return (
      <View>
        <ActivityPicker />
        <View style={styles.segment}>
          <View style={styles.sliderContainer1}>
              <SegmentedControls
                tint={'#ff0066'}
                selectedTint={'white'}
                backTint={'white'}
                options={this.state.transportOptions}
                allowFontScaling={false}
                fontWeight={'bold'}
                onSelection={this.handleTransportSelected.bind(this)}
                selectedOption={this.state.transportSelectedOption} />
          </View>
          <View style={styles.sliderContainer2}>
            {this.renderDistanceSegment()}
          </View>
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
            fillColor="rgba(200, 0, 0, 0.4)"
            strokeColor="rgba(0,0,0,0.5)"/>
          <MapView.Marker
            coordinate={this.state.coordinate}/>
        </MapView>
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)} >
            <Text style={styles.buttonText}> Roam! </Text>
        </TouchableHighlight>
      </View>
    );
  }
  }
}

class PendingRoam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      address: null,
      time: null,
      queryType: '',
      stateChange: props.passedDownStateChange
    };
  }

  handleCancel() {
    //we will cancel roam from here
    //remove the roam from db
    //take the user back to the 'Time' page
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
      if (res.status === 200) {
        AlertIOS.alert('deletion successful');
      } else {
        AlertIOs.alert('something wrong happened');
      }
    })
    .catch((error) => {
      console.log('Error handling submit:', error);
    });

  }

  render() {
    return (
      <Image style={stylesFile.backgroundImage}
        source={require('../../imgs/uni.jpg')}>
        <Text style={stylesFile.title}> ROAM </Text>

          <Text>We will notify you once you are matched</Text>
          <Text>{this.state.address}</Text>
          <Text>Roam starts at {this.state.time}</Text>
          <TouchableHighlight
            style={stylesFile.button}
            onPress={this.handleCancel.bind(this)}
            underlayColor="white" >
              <Text style={stylesFile.buttonText}>Cancel Roam</Text>
          </TouchableHighlight>

      </Image>
    );
  }
}

class MatchedView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      isLoading: false,
      error: false,
      errorMessage: '',
      roamingData: props.data,
      buddy: 'Ben',
      destination: 'Sonoma',
      address: '4263 Market Street',
      meetupTime: '6:00 PM',
      stateChange: props.passedDownStateChange
    };
  }

  componentDidMount() {
    if (this.state.roamingData.username1 === this.state.user.id) {
      this.state.buddy = this.state.roamingData.username2;
    } else {
      this.state.buddy = this.state.roamingData.username1;
    }

    this.setState({
      destination: this.state.roamingData.venue,
      address:  this.state.roamingData.address,
      meetupTime: this.state.roamingData.date
    })

  }

  handleUberClick() {
    // AlertIOS.alert(
    //   'Uber\'s been ordered for ' + this.state.destination + '!'
    // );
    this.state.stateChange(1);
    AlertIOS.alert('cancelling match');
  }
  handleCancel() {
    //we will cancel roam from here
    //remove the roam from db
    //take the user back to the 'Time' page
    this.state.stateChange(1);
  }
  
  render() {
    var showErr = (
      this.state.error ? <Text style={stylesFile.errorMessage}> {this.state.errorMessage} </Text> : <View></View>
    );
    return(
      <Image style={stylesFile.backgroundImage}
        source={require('../../imgs/uni.jpg')}>
        <Text style={stylesFile.title}> Match! </Text>
        <Text style={[stylesFile.subTitle, stylesFile.boldify]}> { this.state.destination }</Text>
        <Text style={[stylesFile.subTitle, stylesFile.boldify]}> { this.state.address }</Text>
        <Text style={stylesFile.subTitle}>Buddy: { this.state.buddy }</Text>
        <Text style={stylesFile.subTitle}>Meetup Time: <Text style={stylesFile.boldify}>{ this.state.meetupTime }</Text></Text>
        <Geolocation />
        <TouchableHighlight
          onPress={this.handleUberClick.bind(this)}
          underlayColor="transparent" >
            <Image style={stylesFile.button}source={require('../../imgs/UberButton.png')}></Image>
        </TouchableHighlight>
        {/* This is the loading animation when isLoading is set to true */}
        <ActivityIndicatorIOS
          animating={this.state.isLoading}
          color="#111"
          size="large"></ActivityIndicatorIOS>
        {showErr}
      </Image>
    )
  }
}

const styles = StyleSheet.create({
  navbarContainer:{
    backgroundColor: 'transparent',
    paddingTop: deviceHeight/25,
    height: deviceHeight/3,
    borderBottomColor: 'white',
    borderWidth: 2
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
    // justifyContent: 'center'
  },
  location: {
    backgroundColor: 'transparent',
    fontSize: 25,
    color: 'white',
    textAlign: 'center'
  },
  map: {
    height: deviceHeight/3,//deviceHeight/2.28,
    width: deviceWidth,
    backgroundColor: 'transparent'
  },
  segment: {
    flexDirection: 'row'
  },
  sliderContainer1: {
    width: 3 * deviceWidth/10,
    padding: 10
  },
  sliderContainer2: {
    width: 7 * deviceWidth/10,
    padding: 10
  }
});

module.exports = RoamView;