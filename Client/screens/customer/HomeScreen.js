import React, { Component } from 'react'
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import FavoriteBusinessCard from './FavoriteBusinessCard'
import styles from '../../styles/customer/Style_HomeScreen';
import { connect } from "react-redux";
import * as ActionCreators from '../../redux/actions/Actions_User';
import database from '../../database';

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEmpty: false,
      favoritesList: database.businesses
    }

    this.renderEmptyScreen = this.renderEmptyScreen.bind(this);
    this.renderFavoritesList = this.renderFavoritesList.bind(this);
  }

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
        data={this.state.favoritesList}
        keyExtractor={item => item.ID.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FavoriteBusinessCard businessData={item} navigation={this.props.navigation} />
        )}
      />
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.flexContainer}>
        <View style={styles.flexContainer}>
          <Text style={styles.heading}>My Services</Text>
          {this.state.isEmpty === true ? this.renderEmptyScreen() : this.renderFavoritesList()}
          {/* <TouchableOpacity onPress={() => this.props.reduxUpdateHasBusiness()}>
            <Text>Update</Text>
          </TouchableOpacity>
          <Text>{this.props.hasBusiness.toString()}</Text> */}
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ User }) => {
  return {
    hasBusiness: User.hasBusiness,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reduxUpdateHasBusiness: () => dispatch(ActionCreators.updateHasBusiness()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
