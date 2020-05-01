import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as Actions_App from '../redux/actions/Actions_App';
import * as Actions_User from '../redux/actions/Actions_User';
import * as Actions_Customer from '../redux/actions/Actions_Customer';
import * as Actions_Business from '../redux/actions/Actions_Business';
import { connect } from 'react-redux';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    this.initApp = this.initApp.bind(this);
    this.fetchCategoriesList = this.fetchCategoriesList.bind(this);
    this.fetchUserProfile = this.fetchUserProfile.bind(this);
  }

  componentDidMount() {
    this.initApp();
  }
  
  async initApp() {
    await this.fetchCategoriesList();
    await this.fetchUserProfile();
  }

  async fetchCategoriesList() {
    const url = `http://192.168.1.198:3000/business/getCategoriesList`;
    const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        let splits = data.categories.slice(1, data.categories.length - 1).split(',');
        let categoriesArr = splits.map((item) => {
          return { label: item, value: item }
        });
        this.props.dispatch(Actions_App.updateCategoriesList(categoriesArr));
        // console.log(this.props.categoriesList);
      })
      .catch(error => console.log(error))
  }

  async fetchUserProfile() {
    const url = 'http://192.168.1.198:3000/user/getUserByEmail';
    const options = { 
      method: 'POST', 
      headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
      },
      body: JSON.stringify({email: this.props.route.params.email})
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        // console.log(data.user)
        this.props.dispatch(Actions_User.updateCurrentUser(data.user));
        console.log('User ID: ' + this.props.currentUser.userid);
      })
      .catch(error => console.log(error))
  }

  render() {
    console.log(this.props.route.params.email)
    return (
      <View style={{ flex: 1, backgroundColor: 'white', alignContent: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size={'large'}/>
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
  }
}

export default connect(mapStateToProps)(SplashScreen);
