"use strict";

import React, {
  Component,
} from 'react';

import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableHighlight
} from 'react-native';
 
 
// import UserPageObj from './UserPage.ios.js';
// var UserPage = UserPageObj.UserPage;

// import SwipePage from './SwipeView.ios.js';
var ViewProfPic = require('./ViewProfPic.js');
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
// import ViewPage from './ImageView.ios.js';
// import NewUserInstructionModal from './NewUserInstructionModal.ios.js';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var icons = {
  list: 'http://www.iconsdb.com/icons/preview/gray/list-xxl.png',
  grid: 'http://www.myiconfinder.com/uploads/iconsets/256-256-ed559f9ab4ee6cec08ffde71c58a68af-grid.png',
  home: 'http://summer.newark.rutgers.edu/wp-content/uploads/2015/02/homeicon.png',
  camera: 'http://aspenwillows.com/wp-content/uploads/2015/03/cameraicon.png',
  swipe: 'https://www.one.org/wp-content/plugins/ebola-tracker/images/swipe_icon.png',
  pressCamera: 'http://www.iconsplace.com/icons/preview/white/switch-camera-256.png',
  switchCamera: 'http://www.iconsplace.com/icons/preview/white/switch-camera-256.png'
}

class CameraView extends Component {
 
  constructor(props) {
      super(props);
      this.state = {
        user: props.user,
        image: null,
        type: Camera.constants.Type.back,
        flag: true,
        navigator: this.props.navigator
      }
  }

  goBackToProfile() {
    this.state.navigator.pop();
  }

  render() {
      return (
        <View style={styles.container}>
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            captureTarget={Camera.constants.CaptureTarget.disk}
            aspect={Camera.constants.Aspect.fill}
            orientation={Camera.constants.Orientation.portrait}
            type = {this.state.type}
            >
            <TouchableHighlight style={styles.getOut} onPress={this.goBackToProfile.bind(this)} underlayColor='transparent'>
              <Image source={require('./Images/reject.png')} style = {{height:40, width: 40, marginLeft: 40}} />
            </TouchableHighlight>
            <TouchableHighlight style={styles.switchCam} onPress={this.switchCamType.bind(this)} underlayColor='transparent'>
              <Image style = {{height:40, width: 40, marginLeft: 40}} source={require('./Images/switch_camera_type.png')}/>
            </TouchableHighlight>
            <View style={styles.buttons}>
              <TouchableHighlight onPress={this.takePicture.bind(this)} style={styles.capture} underlayColor='transparent'>
                <Image style = {{height: deviceWidth/6, width: deviceWidth/5.5}} source={require('./Images/camera_icon3.png')}/>
              </TouchableHighlight>
            </View>

          </Camera>
        </View>
      );
  }

  goImageViewPage() {
    this.props.navigator.push({
      title: "View Profile Picture",
      component: ViewProfPic,
      passProps: {user: this.state.user, username: this.state.username, password: this.state.password, image: this.state.image, id: this.state.id, lastPhoto: this.state.lastPhoto},
    })
  }

  switchCamType() {
    if (this.state.flag) {
      this.setState({
        type: Camera.constants.Type.front,
        flag: false
      });

    } else {
     this.setState({
        type: Camera.constants.Type.back,
        flag: true
      });        
    }
  }

  takePicture() {
    this.camera.capture()
      .then((data) => this.setState({image: data}))
      .catch(err => console.error(err))
      .then(() => this.goImageViewPage());
  }
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  switchCam: {
    left: deviceWidth/3, 
    top: -deviceHeight/1.4,
  },
  capture: {
    marginBottom: deviceHeight/10
  },
  buttons: {
    flexDirection: 'row'
  },
  swipe: {
    paddingRight: deviceWidth/5,
    paddingTop: deviceHeight/15
  },
  home: {
    paddingLeft: deviceWidth/5,
    paddingTop: deviceHeight/15
  },
  info: {
    right: deviceWidth/2.2, 
    top: -deviceHeight/1.48,
  },
  exit: {
    width: deviceWidth /6,
    height: deviceWidth/6,
  },
  getOut: {
    left: -deviceWidth/2.4, 
    top: -deviceHeight/1.55,
  }
});
 
module.exports = CameraView;
