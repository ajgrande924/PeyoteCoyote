import React, { Component } from 'react';

var SignUp = require('./Signup');
var styles = require('./Helpers/styles');
var TabBar = require('./TabBar.js');
import {
  AlertIOS,
  Image,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS
} from 'react-native';

class VerifyText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      code: '',
      isLoading: false,
      error: false,
      errorMessage: ''
    };
  }

  ComponentDidMount() {
    this.handleResendCode();
  }

  handleTextCode(event) {
    this.setState({
      code: event.nativeEvent.text
    });
  }  


  handleSubmitCode() {
    fetch('http://localhost:3000/checkCode', 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({code: this.state.user.verificationCode, codeSubmitted: this.state.code})
    })
    .then((response) => {
      if (response.status === 200) {
        fetch('http://localhost:3000/verified', 
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id: this.state.user.id, user: this.state.user})
        });
        AlertIOS.alert('One-time Verification Complete\n\nPhone Linked');
        this.props.navigator.push({
          title: 'Roam',
          component: TabBar,
          passProps: {user: this.state.user}
        });
      } else {
        this.setState({isLoading: false, error: true, errorMessage: 'Incorrect Code!', code: ''});
      }
    });
  }

  handleResendCode() {
    fetch('http://localhost:3000/sendTxt',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: this.state.user.name, code: this.state.user.verificationCode, phoneNumber: this.state.user.phone})
    })
    .then(() => AlertIOS.alert('Code Sent'));
  }

  render() {
    var showErr = (
      this.state.error ? <Text style={styles.errorMessage}> {this.state.errorMessage} </Text> : <View></View>
    );
    return(
      <Image style={styles.backgroundImage}
      source={require('../../imgs/uni.jpg')}>
        <Text style={styles.title}> verify </Text>
        <TextInput
          style={styles.submit}
          placeholder="Enter Code"
          placeholderTextColor="white"
          value={this.state.code}
          onChange={this.handleTextCode.bind(this)}/>
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmitCode.bind(this)}
          underlayColor="white" >
            <Text style={styles.buttonText}> Submit Code </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleResendCode.bind(this)}
          underlayColor="white" >
            <Text style={styles.buttonText}> Resend Code </Text>
        </TouchableHighlight>
        <ActivityIndicatorIOS
          animating={this.state.isLoading}
          color="#111"
          size="large"></ActivityIndicatorIOS>
        {showErr}
      </Image>
    )
  }
}

module.exports = VerifyText;