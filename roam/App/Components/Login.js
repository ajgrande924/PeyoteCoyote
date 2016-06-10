import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
//Require authentication component
var SignUp = require('./Signup');
var Time = require('./Time');
// var styles = require('./Helpers/styles');
var TabBar = require('./TabBar.js');
var VerifyText = require('./VerifyText.js');

import {
  Dimensions,
  Image,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS
} from 'react-native';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isLoading: false,
      error: false,
      errorMessage: ''
    };
  }

  handlePassword(event) {
    this.setState({
      password: event.nativeEvent.text
    });
  }  

  handleUsername(event) {
    this.setState({
      username: event.nativeEvent.text
    });
  }

  handleSignIn() {
    this.setState({
      isLoading: true
    });
    if (this.state.password === '') {
      this.setState({
        isLoading: false,
        error: true,
        errorMessage: 'Invalid Password!'
      });
    }

    //If username and password exists on the database, log the user into the select time page
    if(this.state.username !== '' && this.state.password !== ''){
      fetch('http://localhost:3000/signin', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: this.state.password,
          username: this.state.username,
        })
      })
      .then((res) => {
        if (res.status === 400) {
          this.setState({errorMessage: "Incorrect Username or Password", password: '', error: true, isLoading: false});
        } else{
          res = JSON.parse(res._bodyInit);
          fetch('http://localhost:3000/isVerified',
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: res.id})
          })
          .then(resp => {
            if (resp.status === 200) {
              this.props.navigator.push({
                title: 'Roam',
                passProps: {user: res},
                component: TabBar
              });
            } else {
              this.props.navigator.push({
                title: 'Verify Phone Link',
                component: VerifyText,
                passProps: {user: res}
              });
            }
          })
          
          this.setState({
            isLoading: false
          });
        }
      })
      .catch((error) => {
        console.log('Error handling submit:', error);
      });
    }
  }

  handleSignUp() {
    this.setState({
      isLoading: true
    });
    this.props.navigator.push({
      title: 'Create Account',
      component: SignUp
    });
    this.setState({
      isLoading: false
    });
  }

  render() {
    var showErr = (
      this.state.error ? <Text style={styles.errorMessage}> {this.state.errorMessage} </Text> : <Text style={styles.errorMessage}> </Text>
    );
    return(
      <Image style={styles.backgroundImage}
      source={require('../../imgs/uni.jpg')}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}> roam </Text>
        <View style={styles.inputBar}>
          <View style={styles.icon}>
            <TouchableHighlight underlayColor='transparent'>
              <Icon name="user" size={20} color="#fff" />
            </TouchableHighlight>
          </View>
          <View style= {styles.lineName}>
            <TextInput
              style={styles.submit}
              placeholder="Username"
              placeholderTextColor="white"
              value={this.state.username}
              onChange={this.handleUsername.bind(this)}/>
          </View>
        </View>
        <View style={styles.inputBar}>
          <View style={styles.icon}>
            <TouchableHighlight underlayColor='transparent'>
              <Icon name="lock" size={20} color="#fff" />
            </TouchableHighlight>
          </View>
          <View style= {styles.lineName}>
            <TextInput
              style={styles.submit}
              placeholder="Password"
              placeholderTextColor="white"
              value={this.state.password}
              onChange={this.handlePassword.bind(this)}
              secureTextEntry={true}/>
            </View>
        </View>
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSignIn.bind(this)}
          underlayColor="white" >
            <Text style={styles.buttonText}> Sign In </Text>
        </TouchableHighlight>
        <TouchableHighlight
          // style={styles.button}
          onPress={this.handleSignUp.bind(this)}
          underlayColor="transparent" >
            <Text style={styles.signUpButton}> Not a user? Sign Up </Text>
        </TouchableHighlight>
        {/* This is the loading animation when isLoading is set to true */}
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
  inputBar: {
    marginBottom: deviceHeight/40,
    borderBottomColor: 'white',
    borderBottomWidth: 0.5,
    flexDirection: 'row', 
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
  signUpButton: {
    color: 'white',
    textAlign: 'center',
    paddingTop: deviceHeight/40,
    fontSize: deviceHeight/40
  },
  backgroundImage: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
    padding: deviceWidth/10,
    paddingTop: deviceHeight/6,
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

module.exports = Login;
