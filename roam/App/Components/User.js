import React, { Component } from 'react';
import { SegmentedControls } from 'react-native-radio-buttons';
import Icon from 'react-native-vector-icons/FontAwesome';

var Confirmation = require('./Confirmation');
var CameraView = require('./CameraView')
var Separator = require('./Helpers/Separator');
var dummyData = require('./data');
// const baseLink_history = 'https://api.mlab.com/api/1/databases/frantic-rust-roam/collections/history?apiKey=';
// const mongoDB_API_KEY = 'yjH4qEJR-Olag89IaUTXd06IpuVDZWx1';

import history from './data-new.js';

var coordinates = {};
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


import {
  Dimensions,
  Image,
  ListView,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      pictures: [],
      dataSource: null,
      navigator: props.navigator,
      loaded: false,
    };
  }
  componentDidMount() {
    this.getHistory();
    // history.forEach(function(obj) {
    //   fetch(baseLink_history + mongoDB_API_KEY, {
    //     method: 'POST',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(obj),
    //   });
    // });
  }

  getHistory() {
    const obj = {
      username: this.state.user.username,
    };
    fetch('http://localhost:3000/history', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
    .then((response) => {
      if (response.status === 201) {
        this.setState({
          pictures: JSON.parse(response._bodyInit),
          dataSource: ds.cloneWithRows(JSON.parse(response._bodyInit)),
          loaded: true,
        });
      }
    })
    .catch((error) => {
      console.warn(error);
    });
  }

  // handleSelected(choice) {
  //   this.setState({
  //     selectedOption: choice
  //   });
  // }

  goToCamera(){
    var getCamera = require('./CameraView');
    this.props.navigator.push({
      title: CameraView.title,
      component: CameraView,
      passProps: { user: this.state.user },
    });
  }

  renderLoadingView() {
    return (
      <View>
        <Text>Test</Text>
      </View>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    return (
      <View>
        <Image style={styles.backgroundImage}
        source={require('../../imgs/uni.jpg')}>
        <View style={styles.navbarContainer}>
          <View style={styles.profileContainer}>
            <View>
              <Image style={styles.circleImage} source={{uri: 'http://liketherazor.com/wp-content/uploads/2014/12/13-Chris-Gillett-Houston-Headshot-Photographer-Brenna-Smith-1024x732.jpg'}}/> 
            </View>
            <View style={styles.titles}>
              <Text style={styles.navTitle}>jjones</Text>
              <TouchableHighlight underlayColor='transparent'>
                <Icon name="camera" onPress={this.goToCamera.bind(this)} size={23} color="#fff" />
              </TouchableHighlight>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.stat}>18</Text>
              <Text style={styles.statTitle}>Roams</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.stat}>8.5</Text>
              <Text style={styles.statTitle}>Rating</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.stat}>18</Text>
              <Text style={styles.statTitle}>Roams</Text>
            </View>
          </View> 
        </View>

        <View style={styles.mainContainer}>
          <ListView
            contentContainerStyle={styles.gridList}
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false}
            // renderRow={(rowData) => this.typeOfList.bind(this, rowData)}
            renderRow={(rowData) => <GridListItem history={rowData} />}
          />
        </View>
        </Image>
      
      </View>
    );
  }
}

class GridListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: props.history,
      animationType: 'slide',
      modalVisible: false,
      transparent: true,
    };
  }

  setModalVisible(visible, deleteFlag, picID) {
    this.setState({modalVisible: visible});
  }

  render() {
    
    var modalBackgroundStyle = {backgroundColor: 'rgba(0, 0, 0, 0.5)'};
    var innerContainerTransparentStyle = {backgroundColor: '#fff', padding: 20};

    return (
      <View>
        <Modal
          animationType={this.state.animationType}
          transparent={this.state.transparent}
          visible={this.state.modalVisible}
          onRequestClose={() => {this.setModalVisible(false)}}
          >
          <View style={[styles.container, modalBackgroundStyle]}>
            <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
              <View style={styles.modalTitleContainer}>
                <Text
                  style={styles.modalTitle}>
                  {this.state.history.username2}
                </Text>
              </View>
              <Image 
                source={{uri: this.state.history.username2pic}}
                style={styles.modalCircleImage}/>
              <View style={styles.modalInfoContainer}>
                <View style={styles.modalInfoBox}>
                  <Text style={styles.statNumbers}>Roamed in</Text>
                  <Text style={styles.statText}>{this.state.history.placeRoamed}</Text>
                </View>
                <View style={styles.modalInfoBox}>
                  <Text style={styles.statNumbers}>Rating</Text>
                  <Text style={styles.statText}>{this.state.history.rating2}</Text>
                </View>
              </View>
              <View style={styles.closeContainer}> 
                <TouchableHighlight style={styles.closeButton} onPress={this.setModalVisible.bind(this, false, false)}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.gridListItem}>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={this.setModalVisible.bind(this, true)}>
            <Image 
              source={{uri: this.state.history.username2pic}}
              style={styles.gridListPicture}
            />
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navbarContainer:{
    backgroundColor: 'transparent',
    paddingTop: deviceHeight/25,
    height: deviceHeight/3,
    borderBottomColor: 'white',
    borderWidth: 2
  },
  navTitle: {
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 20,
    fontFamily: 'Avenir',
    marginRight: deviceWidth/40
  },
  profileContainer: {
    height: deviceHeight/6,
    width: deviceWidth,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  statsContainer: {
    height: deviceHeight/9,
    width: deviceWidth,
    flexDirection: 'row'
  },
  statBox: {
    width: deviceWidth/3,
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'center'
  },
  stat: {
    fontSize: 25,
    color: 'white',
  },
  statTitle: {
    fontSize: 10,
    color: '#ff0066',
  },
  titles: {
    flexDirection: 'row',
  },
  header: {
    // marginBottom: 20,
    fontSize: 50,
    fontWeight: "100",
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    letterSpacing: 3
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 50,
    width: 300,
    flexDirection: 'row',
    backgroundColor: '#ff0066',
    borderRadius:10,
    marginBottom: 10,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex:1,
    width:null,
    height: null,
    // padding: 30,
    // marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  circleImage: {
    height: deviceWidth/5,
    borderRadius: deviceWidth/10,
    width: deviceWidth/5,
    borderColor: 'white',
    borderWidth: 1.5
  },
  modalCircleImage: {
    height: deviceWidth/3,
    borderRadius: deviceWidth/6,
    width: deviceWidth/3,
    borderColor: 'white'
  },
  mainContainer: {
    height: deviceHeight
  },
  gridList: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // borderBottomColor: '#47315a',
    // borderBottomWidth: 0.5,
    // borderTopColor: '#47315a',
    // borderTopWidth: 0.5,
    marginBottom: 5,
    // height: deviceHeight/2
  },
  gridListItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: deviceWidth/3,
    height: deviceWidth/3,
  },
  gridListPicture: {
    width: deviceWidth/5,
    height: deviceWidth/5,
    borderRadius: deviceWidth/10,
    borderColor: 'white',
    borderWidth: 1.5
    // paddingTop: deviceWidth/20,
    // paddingBottom:deviceWidth/20,
    // paddingLeft: deviceWidth/20,
    // paddingRight: deviceWidth/20
  },
  modalTitle: {
    width: deviceWidth/2,
    textAlign: 'center',
    borderWidth: 0.5,
    paddingTop: deviceHeight/110,
    paddingBottom: deviceHeight/110,
    margin: 5,
    fontSize: 18,
    fontFamily: 'Avenir'
  },
  modalInfoContainer: {
    flexDirection: 'row',
    // borderTopColor: '#47315a',
    // borderTopWidth: 0.5,
    // borderBottomColor: '#47315a',
    // borderBottomWidth: 0.5,
  },
  modalInfoBox: {
    width: deviceWidth/3.3,
    alignItems: 'center',
    borderWidth: 0.5,
    paddingTop: deviceHeight/110,
    paddingBottom: deviceHeight/110,
    margin: 5
  },
  modalPicture: {
    width: deviceWidth/2,
    height: deviceHeight/2
  },
  modalButton: {
    width: deviceWidth/3.3,
    textAlign: 'center',
    borderWidth: 0.5,
    paddingTop: deviceHeight/110,
    paddingBottom: deviceHeight/110,
    margin: 5
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    // padding: 10
  },
  innerContainer: {
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: deviceWidth/12,
    marginRight: deviceWidth/12
  },
})



module.exports = User;
