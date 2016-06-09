'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import FMPicker from '../Lib/index.js';

var options = ['Hot Yoga', 'Regular Yoga', 'Restaurants', 'Bars', 'Food', 'Excercise', 'Siteseeing', ];

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
                <Text>{this.state.selectedOption}</Text>
                <Text
                    style={{color:'blue', marginTop: 20}}
                    onPress={()=>{
                        this.refs.picker.show();
                    }}>
                    Click here to select your option
                </Text>
                <FMPicker ref={'picker'} options={options}
                    onSubmit={(option)=>{
                        this.setState({selectedOption: option})
                    }}
                    />
            </View>
        );
    }
};

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
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
});

module.exports = ActivityPicker;