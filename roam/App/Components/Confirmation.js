import React, { Component } from 'react';
import {Text, View, Image, TouchableHighlight, ListView} from 'react-native'
var styles = require('./Helpers/styles');

class Confirmation extends Component {

  constructor(props) {
      super(props);
      this.state = {
        user: props.user,
        navigator: props.navigator,
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
      this.state.navigator.pop();
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
      <Image style={styles.backgroundImage}
        source={require('../../imgs/uni.jpg')}>
        <Text style={styles.title}> roam </Text>

          <Text style={styles.confirmation}>Great! We are working on finding your next Roam!</Text>
          <Text style={styles.confirmation}>We will notify you the details through email.</Text>
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


module.exports = Confirmation;
