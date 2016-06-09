'use strict';

import React, { Component } from 'react';

import {
  Dimensions,
  StyleSheet
} from 'react-native';


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
  signupContainer: {
    marginTop: -deviceHeight/6,
  },
  verifyContainer: {
    marginTop: -deviceHeight/2,
  },
  header: {
    marginBottom: 20,
    fontSize: 50,
    fontWeight: "100",
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    letterSpacing: 3
  },
  submit: {
    height: deviceHeight/40,
    marginBottom: deviceHeight/200,
    fontSize: deviceHeight/40,
    borderColor: 'white',
    color: 'white',
    textAlign: 'center'
  },
  inputBar: {
    marginBottom: deviceHeight/30,
    // borderBottomColor: 'red',
    // borderLeftColor: 'red',
    // // borderRightColor: 'red',
    // // borderTopColor: 'transparent',
    // borderWidth: 1
  },

  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  boldify: {
    fontWeight: 'bold',
  },
  button: {
    height: deviceHeight/20,
    width: deviceWidth/2,
    flexDirection: 'row',
    backgroundColor: 'pink',
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
    borderColor: 'black',
    padding: 10,
    textAlign: 'center',
    justifyContent: 'center'
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
  confirmation: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 25,
    paddingBottom: 10
  },
  location: {
    backgroundColor: 'transparent',
    fontSize: 25,
    color: 'white',
    textAlign: 'center'
  },
    map: {
    height: deviceHeight/2.5,
    width: deviceWidth/1.25,
  },
});

module.exports = styles;
