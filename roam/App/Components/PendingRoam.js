import React, { Component } from 'react';
import {AlertIOS, Text, View, Image, TouchableHighlight, ListView, Dimensions, StyleSheet} from 'react-native';


class PendingRoam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      address: null,
      time: null,
      queryType: '',
      stateChange: props.passedDownStateChange,
      options: props.options
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
    })
    .catch((error) => {
      console.log('Error handling submit:', error);
    });
  }

  refresh() {
    this.state.stateChange(1);
  }

  render() {
    return (
      <Image style={styles.backgroundImage}
        source={require('../../imgs/uni.jpg')}>
        <TouchableHighlight onPress={this.refresh.bind(this)}>
        <Text> jskdlf;jksladjf;klsajfjs </Text>
        </TouchableHighlight>
        <Text style={styles.title}>roam</Text>
          <Text style={styles.description}>We will notify you once you are matched!</Text>
          <Text style={styles.inputs}>Activity: {this.state.options.activity}</Text>
          <Text style={styles.inputs}>Transportation: {this.state.options.transportation}</Text>
          <Text style={styles.inputs}>Search Radius: {this.state.options.radius}</Text>
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleCancel.bind(this)}
            underlayColor="white" >
              <Text style={styles.buttonText}>Cancel Roam</Text>
          </TouchableHighlight>
      </Image>
    );
  }
}

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  title: {
    marginBottom: deviceHeight/20,
    fontSize: deviceHeight/12,
    fontWeight: "100",
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    letterSpacing: deviceWidth/50,
  },
  description: {
    marginBottom: deviceHeight/60,
    fontSize: deviceHeight/35,
    fontWeight: "100",
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    // letterSpacing: deviceWidth/50,
  },
  inputs: {
    marginBottom: deviceHeight/60,
    fontSize: deviceHeight/35,
    fontWeight: "100",
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    // letterSpacing: deviceWidth/50,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: deviceHeight/20,
    width: deviceWidth/2,
    flexDirection: 'row',
    backgroundColor: '#ff0066',
    marginBottom: deviceHeight/40,
    marginTop: deviceHeight/40,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
    padding: deviceWidth/10,
    // paddingTop: deviceHeight/6,
    // marginTop: deviceHeight/30,
    flexDirection: 'column',
    justifyContent: 'center'
  },
});
module.exports = PendingRoam;