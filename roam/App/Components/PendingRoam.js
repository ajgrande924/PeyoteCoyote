import React, { Component } from 'react';
import {Text, View, Image, TouchableHighlight, ListView} from 'react-native'
var styles = require('./Helpers/styles');


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

module.exports = PendingRoam;
