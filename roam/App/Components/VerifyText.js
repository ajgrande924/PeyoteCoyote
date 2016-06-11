import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';


var SignUp = require('./Signup');
// var styles = require('./Helpers/styles');
var TabBar = require('./TabBar.js');
var dismissKeyboard = require('react-native-dismiss-keyboard');

import {
  AlertIOS,
  Image,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Dimensions
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
    dismissKeyboard();
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
      <View style={styles.verifyContainer}>
        <Text underlayColor='transparent' onPress={this.handleSubmitCode.bind(this)} style={styles.title}> verify </Text>
        <View style={styles.container}>
          <View style={styles.inputBar}>
            <View style={styles.icon}>
              <TouchableHighlight underlayColor='transparent'>
                <Icon name="unlock-alt" size={20} color="#fff" />
              </TouchableHighlight>
            </View>
            <View style= {styles.lineName}>
              <TextInput
                keyboardType="number-pad"
                maxLength={4}
                autoFocus = {true}
                style={styles.submit}
                placeholder="Enter Code"
                placeholderTextColor="white"
                value={this.state.code}
                returnKeyType={'done'}
                onChange={this.handleTextCode.bind(this)}/>
            </View>
          </View>
        </View>
        <View style={styles.buttons}>
          <View style={styles.buttonContainer}>
            <TouchableHighlight
              style={styles.button}
              onPress={this.handleSubmitCode.bind(this)}
              underlayColor="white" >
                <Text style={styles.buttonText}> Submit Code </Text>
            </TouchableHighlight>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableHighlight
              style={styles.button}
              onPress={this.handleResendCode.bind(this)}
              underlayColor="white" >
                <Text style={styles.buttonText}> Resend Code </Text>
            </TouchableHighlight>
          </View>
        </View>
        <ActivityIndicatorIOS
          animating={this.state.isLoading}
          color="#111"
          size="large"></ActivityIndicatorIOS>
        {showErr}
        </View>
      </Image>
    )
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
  submit: {
    height: deviceHeight/30,
    marginBottom: deviceHeight/200,
    fontSize: deviceHeight/47,
    borderColor: 'white',
    color: 'white',
    textAlign: 'left',
  },
  icon: {
    width: deviceWidth/8,
    alignItems: 'center',
    // borderColor: 'white',
    // borderWidth: 0.5,
  },
  lineName: {
    width: deviceWidth/1.5,
    // borderColor: 'white',
    // borderWidth: 0.5,
  },
  container: {
    width: deviceWidth,
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: 'white', 
    // borderWidth: 1,
  },
  inputBar: {
    marginBottom: deviceHeight/40,
    borderBottomColor: 'white',
    borderBottomWidth: 0.5,
    flexDirection: 'row', 
  },
  buttons: {
    flexDirection: 'row',
    width: deviceWidth,
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: 'white', 
    // borderWidth: 1,
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
  // signUpButton: {
  //   color: 'white',
  //   textAlign: 'center',
  //   paddingTop: deviceHeight/40,
  //   fontSize: deviceHeight/40
  // },
  backgroundImage: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
    // padding: deviceWidth/10,
    // paddingTop: deviceHeight/6,
    marginTop: deviceHeight/30,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  errorMessage: {
    backgroundColor: 'transparent',
    height: deviceHeight/10,
    color: '#ff0066',
    textAlign: 'center',
    fontSize: deviceHeight/40,
  },
});

module.exports = VerifyText;