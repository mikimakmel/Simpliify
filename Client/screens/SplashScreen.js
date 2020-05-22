import React, { Component, Children } from 'react';
import { View, Text, ActivityIndicator, Image, Button, Vibration, Platform } from 'react-native';
import * as Actions_App from '../redux/actions/Actions_App';
import * as Actions_User from '../redux/actions/Actions_User';
import * as Actions_Customer from '../redux/actions/Actions_Customer';
import * as Actions_Business from '../redux/actions/Actions_Business';
import { connect } from 'react-redux';
import { BarIndicator } from 'react-native-indicators';
import Colors from '../constants/Colors';
require('../firebaseConfig');
import * as firebase from 'firebase';
import * as Location from 'expo-location';
import route from '../routeConfig';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.route.params.email,
      profilePic: this.props.route.params.profilePic,
      shouldUpdate: false,
      expoPushToken: '',
    };
    this.initApp = this.initApp.bind(this);
    this.fetchCategoriesList = this.fetchCategoriesList.bind(this);
    this.fetchUserProfile = this.fetchUserProfile.bind(this);
    this.fetchUserFavoritesList = this.fetchUserFavoritesList.bind(this);
    this.fetchManagerBusiness = this.fetchManagerBusiness.bind(this);
    this.fetchBusiness = this.fetchBusiness.bind(this);
    this.isBusinessInFavorites = this.isBusinessInFavorites.bind(this);
    this.fetchCustomerOrdersList = this.fetchCustomerOrdersList.bind(this);
    this.updateUserProfilePic = this.updateUserProfilePic.bind(this);
    this.getPermissionAsync = this.getPermissionAsync.bind(this);
    this.registerForPushNotificationsAsync = this.registerForPushNotificationsAsync.bind(this);
  }

  componentDidMount() {
    this.initApp();
  }
  
  async initApp() {
    console.log('initApp');
    await this.getPermissionAsync();
    await this.updateUserProfilePic();
    await this.fetchUserProfile();
    await this.fetchUserFavoritesList();
    await this.fetchManagerBusiness();
    await this.fetchCustomerOrdersList();
    await this.props.navigation.navigate('Profile');
    await this.registerForPushNotificationsAsync();
    await this.fetchCategoriesList();
  }

  async registerForPushNotificationsAsync() { 
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      // console.log(token);
      await this.setState({ expoPushToken: token });
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }

    // add token to database
    const url = `${route}/user/updateUserPushToken`;
    const options = { 
      method: 'PUT', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        userID: this.props.currentUser.userid,
        push_token: this.state.expoPushToken 
      })
    };
    const request = new Request(url, options);

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        let user = this.props.currentUser;
        user.push_token = token;
        this.props.dispatch(Actions_User.updateCurrentUser(user));
      })
      .catch(error => console.log(error))
  };

  // async checkIfLoggedIn() {
  //   console.log('checkIfLoggedIn');
  //   firebase.auth().onAuthStateChanged(async user => {
  //       if(user) {
  //         this.props.email ? await this.setState({email: this.props.email, shouldUpdate: true}) : await this.setState({email: user.email, shouldUpdate: true});
  //         await this.initApp();
  //         console.log('checkIfLoggedIn: true');
  //       } else {
  //         await this.setState({shouldUpdate: false})
  //         await this.props.navigation.navigate('LogIn');
  //         console.log('checkIfLoggedIn: false');
  //       }
  //   })
  // }

  async getPermissionAsync() {
    // console.log('getPermissionAsync');
    let { status } = await Location.requestPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need location permissions to make this work!');
    }

    let location = await Location.getCurrentPositionAsync({});
    this.props.dispatch(Actions_User.updateUserLocation(location));
  }

  async fetchCategoriesList() {
    // console.log('fetchCategoriesList');
    const url = `${route}/business/getCategoriesList`;
    const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => this.props.dispatch(Actions_App.updateCategoriesList(data)))
      .catch(error => console.log(error))
  }

  async updateUserProfilePic() {
    // console.log('updateUserProfilePic');
    if(this.props.route.params.socialLogin) {
      const url = `${route}/user/updateUserProfilePic`;
      const options = { 
        method: 'PUT', 
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email: this.state.email, profilePic: this.state.profilePic})
      };
      const request = new Request(url, options);

      await fetch(request)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          // let user = data.user;
          // user.profilepic = this.props.route.params.profilePic;
          // this.props.dispatch(Actions_User.updateCurrentUser(user))
        })
        .catch(error => console.log(error))
    }
  }

  async fetchUserProfile() {
    // console.log('fetchUserProfile');
    const url = `${route}/user/getUserByEmail`;
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ email: this.state.email })
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        // console.log('======================')
        // console.log(data)
        // console.log('======================')
        // let user = data.user;
        // user.profilepic = this.props.route.params.profilePic;
        this.props.dispatch(Actions_User.updateCurrentUser(data.user))
      })
      .catch(error => console.log(error))
  }

  async fetchBusiness(businessID) {
    // console.log('fetchBusiness');
    const url = `${route}/business/getBusinessByID`;
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({businessID})
    };
    const request = new Request(url, options)

    return await fetch(request)
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => console.log(error))
  }

  async fetchUserFavoritesList() {
    // console.log('fetchUserFavoritesList');
    // console.log(this.props.currentUser.userid)
    const url = `${route}/customer/getFavoritesList`;
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ userID: this.props.currentUser.userid })
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        data.map((item) => {
          this.fetchBusiness(item.business).then((result) => {
            if(!this.isBusinessInFavorites(result.businessDetails.business.businessid)) {
              this.props.dispatch(Actions_Customer.addToFavoritesList(result));
            }
          })
        })
      })
      .catch(error => console.log(error))
  }

  isBusinessInFavorites(businessID) {
    let bool = false;
    this.props.favoritesList.map((item) => {
      if(item.businessDetails.business.businessid === businessID) {
        bool = true;
      }
    });
    return bool;
  }

  async fetchManagerBusiness() {
    // console.log('fetchManagerBusiness');
    if(!this.props.currentUser.hasbusiness) {////////////////////////////////////////////////////////////////////////////////
      const url = `${route}/business/getBusinessByManagerID`;
      const options = { 
        method: 'POST', 
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ managerID: this.props.currentUser.userid })
      };
      const request = new Request(url, options)
  
      await fetch(request)
        .then(response => response.json())
        .then(data => {
          this.fetchBusiness(data.businessid)
            .then((result) => {
              this.props.dispatch(Actions_User.updateMyBusiness(result));
            });
        })
        .catch(error => console.log(error))
    }
  }

  async fetchCustomerOrdersList() {
    // console.log('fetchCustomerOrdersList');
    const url = `${route}/order/getAllCustomerOrders`;
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ userID: this.props.currentUser.userid })
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        let noCancelledOrders = data.filter(item => {
          if(item.status !== 'Cancelled') {
            return item;
          }
        })

        this.props.dispatch(Actions_Customer.updateOrdersList(noCancelledOrders));
      })
      .catch(error => console.log(error))
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', alignContent: 'center', justifyContent: 'center'}}>
        <Image source={require('../assets/images/logo.png')} style={{alignSelf: 'center', bottom: 50}}/>
        <BarIndicator color={Colors.red} count={5} size={32} style={{position: 'absolute', bottom: 150, alignSelf: 'center'}}/>
      </View>
    );
  }
}

const mapStateToProps = ({ App, User, Customer, Business}) => {
  return {
    hasBusiness: User.hasBusiness,
    currentUser: User.currentUser,
    favoritesList: Customer.favoritesList,
    categoriesList: App.categoriesList,
    myBusiness: User.myBusiness,
    ordersList: Customer.ordersList,
  }
}

export default connect(mapStateToProps)(SplashScreen);
