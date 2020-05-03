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
    this.fetchUserFavoritesList = this.fetchUserFavoritesList.bind(this);
    this.fetchManagerBusiness = this.fetchManagerBusiness.bind(this);
    this.fetchBusiness = this.fetchBusiness.bind(this);
    this.isBusinessInFavorites = this.isBusinessInFavorites.bind(this);
    this.fetchCustomerOrdersList = this.fetchCustomerOrdersList.bind(this);
  }

  componentDidMount() {
    this.initApp();
  }
  
  async initApp() {
    await this.fetchCategoriesList();
    await this.fetchUserProfile();
    await this.fetchUserFavoritesList();
    await this.fetchManagerBusiness();
    await this.fetchCustomerOrdersList();
    // console.log(this.props.ordersList);
    this.props.navigation.navigate('Profile');
  }

  async fetchCategoriesList() {
    const url = `http://192.168.1.198:3000/business/getCategoriesList`;
    const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => this.props.dispatch(Actions_App.updateCategoriesList(data)))
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
      body: JSON.stringify({ email: this.props.route.params.email })
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => this.props.dispatch(Actions_User.updateCurrentUser(data.user)))
      .catch(error => console.log(error))
  }

  async fetchBusiness(businessID) {
    const url = 'http://192.168.1.198:3000/business/getBusinessByID';
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
        // console.log(data)
        return data;
      })
      .catch(error => console.log(error))
  }

  async fetchUserFavoritesList() {
    const url = 'http://192.168.1.198:3000/customer/getFavoritesList';
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
    if(!this.props.currentUser.hasBusiness) {
      const url = 'http://192.168.1.198:3000/business/getBusinessByManagerID';
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
    const url = 'http://192.168.1.198:3000/order/getAllCustomerOrders';
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
        this.props.dispatch(Actions_Customer.updateOrdersList(data));
      })
      .catch(error => console.log(error))
  }

  render() {
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
    myBusiness: User.myBusiness,
    ordersList: Customer.ordersList,
  }
}

export default connect(mapStateToProps)(SplashScreen);
