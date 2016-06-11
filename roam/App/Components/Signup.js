import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

// var Interests = require('./Interests');
var Time = require('./Time');
var TabBar = require('./TabBar.js');
var VerificationPage = require('./VerifyText.js');

// var styles = require('./Helpers/styles');
var dismissKeyboard = require('react-native-dismiss-keyboard');
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

import {
  Dimensions,
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS
} from 'react-native';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      userName: '',
      password: '',
      passwordAgain: '',
      phone: '',
      isLoading: false,
      error: false,
      errorMessage: ''
    };
  }

  getCode() {
    var text = "";
    var possible = "0123456789";

    for( var i=0; i < 4; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  handleSubmit() {
    dismissKeyboard();
    this.setState({
      isLoading: true
    });
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const rePhone = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
    const rePhone2 = /[1-9][0-9]{2}[1-9][0-9]{6}/; 

    // check if the passwords are greater that 5 characters
    if (this.state.password.length < 5) {
      // console.warn('dafdsafsda', this.state.password.length);
      this.setState({isLoading: false, error: true, errorMessage: 'Password must be > 5 characters!'});
    }

    //check if the passwords entered matches
    else if (this.state.password !== this.state.passwordAgain) {
      this.setState({isLoading: false, error: true, errorMessage: 'Passwords do not match!'});
    }

    //check if the phone supplied is valid
    else if (!rePhone.test(this.state.phone) && !rePhone2.test(this.state.phone) ) {
      this.setState({isLoading: false, error: true, errorMessage: 'Invalid phone number!', phone: ''});
    } else {
      this.setState({
        error: false,
        errorMessage: '',
      });
    }

      if (this.state.firstName !== '' && this.state.userName !== '' && this.state.password !== '' && this.state.passwordAgain !== '' && (this.state.password === this.state.passwordAgain) && (rePhone.test(this.state.phone) || rePhone2.test(this.state.phone))) {
        var verificationCode = this.getCode();
        fetch('http://localhost:3000/signup', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.state.firstName,
            username: this.state.userName,
            password: this.state.password,
            phone: this.state.phone,
            currentlocation: {latitude: 0, longitude: 0},
            verifiedPhone: false,
            verificationCode: verificationCode,
            image: 'https://image.freepik.com/free-icon/male-user-shadow_318-34042.jpg'
          })
        })
        .then((res) => {
          // res = res.json();
          if (res.status === 200) {
            var body = JSON.parse(res._bodyInit);
            body.verifiedPhone = false;
            body.verificationCode = verificationCode;
            console.error(body);
            this.props.navigator.push({
              title: 'Verify Phone Link',
              component: VerificationPage,
              passProps: {user: body}
            });
            //Set isloading to false after conditions
            this.setState({
              isLoading: false
            });
          } else if (res.status === 400) {
            this.setState({
              error: true,
              errorMessage: 'Username and Phone already exist!',
              isLoading: false
            });
          } else if (res.status === 401) {
            this.setState({
              error: true,
              errorMessage: 'Username already exist!',
              isLoading: false
            });
          } else if (res.status === 402) {
            this.setState({
              error: true,
              errorMessage: 'Phone already exist!',
              isLoading: false
            });
          }  

        })
        .catch((error) => {
          console.log('Error handling submit:', error);
        });
      }

  }

  redirectHome() {
      this.props.navigator.popToTop();
  }

  render() {
    var showErr = (
      this.state.error ? <Text style={styles.errorMessage}> {this.state.errorMessage} </Text> : <Text style={styles.errorMessage}> </Text>
    );
    return(
      <Image style={styles.backgroundImage}
        source={require('../../imgs/dude.png')} >
        <View style={styles.logoContainer}>
          <TouchableHighlight onPress={this.redirectHome.bind(this)} underlayColor='transparent'>
            <Image style={styles.logo}
            source={require('../../imgs/logo.png')} />
          </TouchableHighlight>
        </View>
        <View style={styles.signupContainer}>
          {/* Fields that we want to bind the username and password input */}
          <View style={styles.full}>
          <View style={styles.halfLeft}>
            <View style={styles.inputBar}>
              <View style={styles.icon}>
                <TouchableHighlight underlayColor='transparent'>
                  <Icon name="user" size={20} color="#fff" />
                </TouchableHighlight>
              </View>
              <View style= {styles.lineName}>
                <TextInput
                  style={styles.submit}
                  returnKeyType = {"next"}
                  autoFocus = {true}
                  placeholder="First Name"
                  placeholderTextColor="white"
                  onChangeText={(text) => this.setState({firstName: text})}
                  value={this.state.firstName}
                  onSubmitEditing={(event) => { 
                    this.refs.SecondInput.focus(); 
                  }}
                  />
                </View>
            </View>
          </View>
          <View style={styles.halfRight}>
            <View style={styles.inputBar}>
              <View style= {styles.lineName}>
                <TextInput
                  ref='SecondInput'
                  returnKeyType = {"next"}
                  style={styles.submit}
                  placeholder="Username"
                  placeholderTextColor="white"
                  onChangeText={(text) => this.setState({userName: text})}
                  value={this.state.userName}
                  onSubmitEditing={(event) => { 
                    this.refs.ThirdInput.focus(); 
                  }}
                  />
                </View>
              </View>
          </View>
          </View>
          <View style={styles.full}>
          <View style={styles.halfLeft}>
            <View style={styles.inputBar}>
              <View style={styles.icon}>
                <TouchableHighlight underlayColor='transparent'>
                  <Icon name="lock" size={20} color="#fff" />
                </TouchableHighlight>
              </View>
              <View style= {styles.lineName}>  
                <TextInput
                  ref='ThirdInput'
                  returnKeyType = {"next"}
                  style={styles.submit}
                  placeholder="Enter Password"
                  placeholderTextColor="white"
                  onChangeText={(text) => this.setState({password: text})}
                  value={this.state.password}
                  secureTextEntry={true}
                  onSubmitEditing={(event) => { 
                    this.refs.FourthInput.focus(); 
                  }}
                  />
              </View>
            </View>
          </View>
          <View style={styles.halfRight}>
          <View style={styles.inputBar}>
            <View style= {styles.lineName}> 
              <TextInput
                ref='FourthInput'
                returnKeyType = {"next"}
                style={styles.submit}
                placeholder="Confirm Password"
                placeholderTextColor="white"
                onChangeText={(text) => this.setState({passwordAgain: text})}
                value={this.state.passwordAgain}
                secureTextEntry={true}
                onSubmitEditing={(event) => { 
                  this.refs.FifthInput.focus(); 
                }}
                />
            </View>
          </View>
          </View>
          </View>
          <View style={styles.phone}>
          <View style={styles.inputBar2}>
            <View style={styles.icon}>
              <TouchableHighlight underlayColor='transparent'>
                <Icon name="phone" size={20} color="#fff" />
              </TouchableHighlight>
            </View>
            <View style= {styles.lineName}> 
              <TextInput
                ref='FifthInput'
                style={styles.submit}
                autoCapitalize="none"
                placeholder="Phone Number"
                placeholderTextColor="white"
                onChangeText={(text) => this.setState({phone: text})}
                value={this.state.phone}
                keyboardType="number-pad"
                returnKeyType={'done'}
                maxLength={10}
                onSubmitEditing={(event) => { 
                  this.handleSubmit.bind(this)(); 
                }}
                />
            </View>
          </View>
          </View>
          {/* This is the loading animation when isLoading is set to true */}
          </View>
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)}
          underlayColor="white" >
            <Text style={styles.buttonText}> Create Account </Text>
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

const styles = StyleSheet.create({
  logoContainer: {
    width: deviceWidth,
    height: deviceHeight/5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: deviceHeight/7.5,
    marginBottom: deviceHeight/5
  },
  logo: {
    width: deviceWidth/2,
    height: deviceWidth/3.6,
  },
  icon: {
    width: deviceWidth/10,
    alignItems: 'center',
    // borderColor: 'white',
    // borderWidth: 0.5,
  },
  lineName: {
    width: deviceWidth/1.5,
    // borderColor: 'white',
    // borderWidth: 0.5,
  },
  subTitle: {
    marginBottom: deviceHeight/80,
    fontSize: deviceHeight/40,
    fontWeight: "100",
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    letterSpacing: deviceWidth/500
  },
  submit: {
    height: deviceHeight/30,
    marginBottom: deviceHeight/200,
    fontSize: deviceHeight/47,
    borderColor: 'white',
    color: 'white',
    textAlign: 'left',
  },
  inputBar: {
    marginBottom: deviceHeight/40,
    borderBottomColor: 'white',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    marginRight: deviceWidth/70,
    // marginLeft: deviceWidth/10,
    // marginRight: deviceWidth/10, 
  },
  inputBar2: {
    marginBottom: deviceHeight/40,
    borderBottomColor: 'white',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    marginRight: deviceWidth/100,
    width: deviceWidth/1.2
    // marginLeft: deviceWidth/10,
    // marginRight: deviceWidth/10, 
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: deviceHeight/20,
    width: deviceWidth/2,
    flexDirection: 'row',
    backgroundColor: '#ff0066',
    marginBottom: deviceHeight/80,
    // marginTop: deviceHeight/80,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 4
  },
  backgroundImage: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
    paddingTop: deviceHeight/10,
    flexDirection: 'column',
  },
  errorMessage: {
    backgroundColor: 'transparent',
    height: deviceHeight/10,
    color: '#ff0066',
    textAlign: 'center',
    fontSize: deviceHeight/40,
  },
  full: {
    flexDirection: 'row',
    width: deviceWidth,
    alignItems: 'center',
    // borderColor: 'white',
    // borderWidth: 0.5,
  }, 
  halfLeft: {
    marginLeft: deviceWidth/12,
    width: 5 * deviceWidth/12,
    // borderColor: 'white',
    // borderWidth: 0.5,
  },
  halfRight: {
    width: 9.5 * deviceWidth/24,
    // borderColor: 'white',
    // borderWidth: 0.5,
  },
  phone: {
    alignItems: 'center'
  }
});

module.exports = SignUp;
