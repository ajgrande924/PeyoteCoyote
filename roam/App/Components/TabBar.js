import React, {
  Component,
} from 'react';

import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NavigatorIOS,
  TabBarIOS
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Time from './Time.js'
import User from './User.js'
import CurrentRoam from './User.js'

// var key_file = require('../../config.js');
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class TabBar extends Component {  
  constructor(props) {
  	super(props)
  	this.state = {
      user: props.user,
      navigator: props.navigator,
      selectedTab: 'home'
  	}
  }

  render() {
    return (
      <TabBarIOS translucent={false}>
        <Icon.TabBarItem
          title='User'
          selected={this.state.selectedTab === 'home'}
          iconName={'user'}
          iconSize={25}
          onPress={() => {
              this.setState({
                selectedTab: 'home'
              });
          }}>
          {this.renderUserPage()}
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Roam"
          selected={this.state.selectedTab === 'map'}
          iconName={'map'}
          iconSize={20}
          onPress={() => {
              this.setState({
                selectedTab: 'map'
              });
          }}>
          {this.renderRoamView()}
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Current"
          selected={this.state.selectedTab === 'uber'}
          iconName={'envira'}
          iconSize={20}
          onPress={() => {
              this.setState({
                selectedTab: 'uber'
              });
          }}>
          {this.renderCurrentRoamView()}
        </Icon.TabBarItem>
      </TabBarIOS>
      )
  }

  renderUserPage() {
    return (
      <User
        style={styles.container}
        ref='swipeRef'
        user={this.state.user}
        navigator={this.props.navigator}/>
        )
  }

  renderRoamView() {
    return (
      <Time
        style={styles.container}
        ref='mapRef'         
        user={this.state.user}
        navigator={this.props.navigator}/>
        )
  }
  renderCurrentRoamView() {
    return (
      <CurrentRoam
        style={styles.container}
        ref='uberRef'         
        user={this.state.user}
        navigator={this.props.navigator}/>
        )
  }
}

var styles = StyleSheet.create({
	container: {
		height: deviceHeight,
		width: deviceWidth
	}
});
module.exports = TabBar;