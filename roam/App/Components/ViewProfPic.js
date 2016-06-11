"use strict";

import React, {
  Component,
} from 'react';

import {
  AlertIOS,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import { RNS3 } from 'react-native-aws3';
import CameraView from './CameraView';
import Icon from 'react-native-vector-icons/FontAwesome';

var key_file = require('../../api_keys.js'); //key for AWS3
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class Card extends Component {
  render() {
    return (
      <View style={styles.card}>
        <Image style={styles.thumbnail} source={{uri: this.props.image.imageLink}} />
      </View>
    )
  }
}

class ViewProfPic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: props.username || '',
      password: props.password || '',
      image: props.image,
      userId: props.id,
      navigator: this.props.navigator,
      photoObj: ''
    };
  }
 
  // componentDidMount() {
  //   console.error(this.state.image.path);
  // }

  getCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  submitPhoto() {
    if (this.state.username === 'jjones') {
      AlertIOS.alert('Photos cannot be saved in test mode! Please login to save photos!');
    } else {
      const photo = {
        image: this.state.image.path,
        filename: this.getCode() + '.png'
      };
      const file = {
        uri: photo.image,
        name: photo.filename,
        type: "image/png"
      };
      const options = {
        keyPrefix: "uploads/",
        bucket: "franticrust",
        region: "us-west-1",
        accessKey: key_file.s3Keys.S3_ACCESS_KEY, 
        secretKey: key_file.s3Keys.S3_SECRET_KEY,
        successActionStatus: 201
      };

      RNS3.put(file, options).then(response => {
      if (response.status !== 201)
        throw new Error("Failed to upload image to S3");
      });

      const photoObj = {
        username: this.state.userId,
        imageLink: 'https://franticrust.s3-us-west-1.amazonaws.com/uploads%2F' + photo.filename,
      };
      this.state.photoObj = photoObj;
      
      fetch('http://159.203.197.90:3000/upload', 
        {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(photoObj)
        });
      AlertIOS.alert('Photo is now Live');
    }
      this.goBackToProfile();
  }

  goBackToCamera() {
    this.state.navigator.pop();
  }

  goBackToProfile() {
    this.state.navigator.popN(1);
  }

  refreshPage() {

  }

  render() {
    return(
      <Image style={styles.backgroundImage}
      source={require('../../imgs/uni.jpg')}>
      <View style={styles.container}>

        <View style={styles.info}>
        </View>
        <Card image={{imageLink: this.state.image.path}} submitPhoto={this.submitPhoto.bind(this)} />
        <View style={styles.buttonsContainer}>
          <View style={styles.button}>
            <TouchableHighlight onPress={this.goBackToCamera.bind(this)} underlayColor='transparent'>
              <Image source={require('./Images/reject.png')} style={styles.accept} />
            </TouchableHighlight>
          </View>
          <View style={styles.button}>
            <TouchableHighlight onPress={this.submitPhoto.bind(this)} underlayColor='transparent'>
              <Image source={require('./Images/accept.png')} style={styles.accept} />
            </TouchableHighlight>
          </View>
        </View>
      </View>
      </Image>
    );
  }
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbarContainer: {
    backgroundColor:'#FF562E',
    paddingTop: deviceHeight/25,
    height: deviceHeight/12,
    flexDirection: 'row',
    paddingBottom: deviceHeight/80
  },
  navLeft: {
    width: deviceWidth/3,
    justifyContent: 'center',
    paddingLeft: deviceWidth/20
  },
  navMiddle: {
    width: deviceWidth/3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  navRight: {
    width: deviceWidth/3,
    justifyContent: 'center',
    paddingRight: deviceWidth/20,
    flexDirection: 'row',
  },
  navTitle: {
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 20,
    fontFamily: 'Avenir'
  },
  refresh: {
    width: deviceWidth/4,
    alignItems: 'flex-end',
    paddingRight: deviceWidth/20,
  },
  accept: {
    width: deviceWidth /6,
    height: deviceWidth/6,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: deviceWidth,
    height: deviceHeight/6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: deviceWidth/2.2,
    height: deviceHeight/6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  thumbnail: {
    flex: 1,
    width: deviceWidth / 1.1,
    height: deviceHeight / 1.5,
  },
  text: {
    fontSize: 20,
    paddingTop: deviceWidth/80,
    paddingBottom: deviceWidth/80,
    fontFamily: 'Baskerville'
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
    info: {
    right: deviceWidth/2.2, 
    top: -deviceHeight/1.48,
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
});

module.exports = ViewProfPic;