import React, { Component } from 'react';
import { View } from 'react-native';
import colors from '../constants/Colors'
import * as firebase from 'firebase';
require('../firebaseConfig');

class CheckLoginStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.props.navigation.navigate('SplashScreen', {email: user.email});
        console.log('checkIfLoggedIn: YES');
      } else {
        this.props.navigation.navigate('LogIn');
        console.log('checkIfLoggedIn: NO');
      }
    })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}/>
    );
  }
}

export default CheckLoginStatus;
