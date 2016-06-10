'use strict';

import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';

import FMPicker from '../Lib/index.js';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var options = ['Hot Yoga', 'Regular Yoga', 'Restaurants', 'Bars', 'Food', 'Excercise', 'Site Seeing', ];

class ActivityPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: 'Hot Yoga'
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.textContainer}>
                <Text style={styles.title}> I want to go to {this.state.selectedOption}!</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableHighlight
                      style={styles.button}
                      onPress={() => { this.refs.picker.show() }} >
                        <Text style={styles.buttonText}>Select</Text>
                    </TouchableHighlight>
                    <FMPicker ref={'picker'} options={options}
                        onSubmit={(option)=>{
                            this.setState({selectedOption: option})
                        }}
                        />
                </View>
            </View>
        );
    }
};

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row'
    },
    textContainer: {
        width: 3 * deviceWidth/4
    },
    buttonContainer: {
        width: deviceWidth/4
    },
    title: {
        fontSize: 18,
        color: 'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    buttonText: {
      fontSize: 18,
      color: 'white',
      alignSelf: 'center'
    },
    button: {
      height: deviceHeight/15,
      width: deviceWidth/4,
      flexDirection: 'row',
      backgroundColor: '#ff0066',
      // borderRadius:10,
      marginBottom: 10,
      alignSelf: 'center',
      justifyContent: 'center',
    },
});

module.exports = ActivityPicker;