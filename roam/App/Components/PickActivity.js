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

var options = ['Eat Food', 'Exercise', 'Go Shopping', 'Explore a Museum', 'Watch a Movie', 'Drink Coffee'];

class ActivityPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: 'Eat Food',
            callback: props.callback
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}> I want to {this.state.selectedOption}!</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableHighlight
                      style={styles.button}
                      onPress={() => { this.refs.picker.show() }} >
                        <Text style={styles.buttonText}>Select</Text>
                    </TouchableHighlight>
                    <FMPicker ref={'picker'} options={options}
                        onSubmit={(option)=>{
                            this.setState({selectedOption: option});
                            this.state.callback(option);
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
        alignItems: 'center',
        justifyContent: 'center',
        width: 2.5 * deviceWidth/3.5,
    },
    buttonContainer: {
        width: deviceWidth/3.5,
        // alignItems: 'flex-start',
        justifyContent: 'center'
    },
    title: {
        fontSize: 16,
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
      fontSize: 14,
      color: 'white',
      alignSelf: 'center'
    },
    button: {
      height: deviceHeight/30,
      width: deviceWidth/6.5,
      flexDirection: 'row',
      backgroundColor: '#ff0066',
      borderRadius:10,
      alignSelf: 'center',
      justifyContent: 'center',
    },
});

module.exports = ActivityPicker;