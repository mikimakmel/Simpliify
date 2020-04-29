import React, { Component } from 'react'
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import FavoriteBusinessCard from './FavoriteBusinessCard'
import styles from '../../styles/customer/Style_HomeScreen';
import { connect } from "react-redux";
import * as Actions_User from '../../redux/actions/Actions_User';
import * as Actions_Customer from '../../redux/actions/Actions_Customer';
import database from '../../database';

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.renderEmptyScreen = this.renderEmptyScreen.bind(this);
    this.renderFavoritesList = this.renderFavoritesList.bind(this);
    // this.fetchFavoritesList = this.fetchFavoritesList.bind(this);
    // this.fetchBusiness = this.fetchBusiness.bind(this);
    // this.isBusinessInFavorites = this.isBusinessInFavorites.bind(this);
  }

  componentDidMount() {
    // this.fetchFavoritesList();
  }

  // async fetchFavoritesList() {
  //   const url = 'http://192.168.1.198:3000/customer/getFavoritesList';
  //   const options = { 
  //     method: 'POST', 
  //     headers: { 
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json' 
  //     },
  //     body: JSON.stringify({userID: this.props.currentUser.userid})
  //   };
  //   const request = new Request(url, options)

  //   await fetch(request)
  //     .then(response => response.json())
  //     .then(async data => {
  //       // console.log(data)
  //       // this.props.dispatch(ActionCreators.updateCurrentUser(data.user));
  //       data.map((item) => {
  //         this.fetchBusiness(item.business);
  //       })
  //     })
  //     .catch(error => console.log(error))
  // }

  // async fetchBusiness(businessID) {
  //   const url = 'http://192.168.1.198:3000/business/getBusinessByID';
  //   const options = { 
  //     method: 'POST', 
  //     headers: { 
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json' 
  //     },
  //     body: JSON.stringify({businessID})
  //   };
  //   const request = new Request(url, options)

  //   await fetch(request)
  //     .then(response => response.json())
  //     .then(async data => {
  //       // console.log(data)
  //       if (!this.isBusinessInFavorites(data.businessid)) {
  //         this.props.dispatch(Actions_Customer.addToFavoritesList(data))
  //       }
  //     })
  //     .catch(error => console.log(error))
  // }

  // isBusinessInFavorites(businessID) {
  //   this.props.favoritesList.map((item) => {
  //     if(item.businessid === businessID) {
  //       return true;
  //     }
  //   });

  //   return false;
  // }

  renderEmptyScreen() {
    return (
      <View style={styles.emptyListContainer}>
        <Image source={require('../../assets/images/emptyListLogo.png')} style={styles.emptyListIcon} />
        <View style={styles.emptyListTextContainer}>
          <Text style={styles.emptyListHeadingText}>Services List is Empty</Text>
          <Text style={styles.emptyListText}>Start looking for your favorite services now!</Text>
        </View>
        <Button
          title="Find Services"
          type="outline"
          buttonStyle={styles.FindServicesButton}
          titleStyle={styles.FindServicesButtonTitle}
          // onPress={() => this.props.navigation.navigate('Search')}
        />
      </View>
    )
  }

  renderFavoritesList() {
    return (
      <FlatList
        data={this.props.favoritesList}
        // keyExtractor={item => item.businessid.toString()}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FavoriteBusinessCard businessData={item} navigation={this.props.navigation} />
        )}
      />
    )
  }

  render() {
    // console.log(this.props.currentUser);//////////
    // console.log(this.props.view);//////////

    return (
      <SafeAreaView style={styles.flexContainer}>
        <View style={styles.flexContainer}>
          <Text style={styles.heading}>My Services</Text>
          {this.props.favoritesList.length > 0 ? this.renderFavoritesList() : this.renderEmptyScreen()}
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ User, Customer }) => {
  return {
    hasBusiness: User.hasBusiness,
    currentUser: User.currentUser,
    favoritesList: Customer.favoritesList,
    view: User.view
  }
}

export default connect(mapStateToProps)(HomeScreen);


// const mapDispatchToProps = (dispatch) => {
//   return {
//     reduxUpdateHasBusiness: () => dispatch(ActionCreators.updateHasBusiness()),
//   }
// }