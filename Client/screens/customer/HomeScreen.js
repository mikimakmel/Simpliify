import React, { Component } from 'react'
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image, FlatList, StatusBar } from 'react-native';
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
  }

  // componentDidMount() {

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
          onPress={() => this.props.navigation.navigate('Explore')}
        />
      </View>
    )
  }

  renderFavoritesList() {
    return (
      <FlatList
        data={this.props.favoritesList}
        keyExtractor={item => item.businessDetails.business.businessid.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (<FavoriteBusinessCard businessData={item} navigation={this.props.navigation}/>)}
      />
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.flexContainer}>
        <StatusBar barStyle="dark-content"/>
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
