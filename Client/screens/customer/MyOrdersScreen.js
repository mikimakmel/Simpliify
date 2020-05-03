import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Divider, Avatar } from 'react-native-elements';
import styles from '../../styles/customer/Style_MyOrdersScreen';
import database from '../../database';
import colors from '../../constants/Colors';
// import Swipeout from 'react-native-swipeout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from "react-redux";
import * as Actions_Customer from '../../redux/actions/Actions_Customer';
import { Popup } from 'react-native-map-link';
import moment from 'moment';

const weekdayArr = new Array(7);
weekdayArr[0] = "Sunday";
weekdayArr[1] = "Monday";
weekdayArr[2] = "Tuesday";
weekdayArr[3] = "Wednesday";
weekdayArr[4] = "Thursday";
weekdayArr[5] = "Friday";
weekdayArr[6] = "Saturday";

class MyOrdersScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPopupVisble: false,
      itemPressed: {}
    }
    this.renderEmptySchedule = this.renderEmptySchedule.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  // componentDidMount() {

  // }

  renderEmptySchedule() {
    return (
      <View style={styles.emptyListContainer}>
        <Image
          source={require('../../assets/images/emptyScheduleLogo.png')}
          style={styles.emptyListIcon}
        />
        <View style={styles.emptyListTextContainer}>
          <Text style={styles.emptyListHeadingText}>Your Schedule is Empty</Text>
          <Text style={styles.emptyListText}>Book your favorite services now!</Text>
        </View>
      </View>
    )
  }

  renderRow({ item }) {
    // const swipeoutBtns = [
    //   {
    //     text: 'Delete',
    //     type: 'delete',
    //     backgroundColor: 'red',
    //     underlayColor: colors.lightBlack,
    //     // onPress: () => this.handleDeletePress(item)
    //   }
    // ]

    if(item.status === 'Cancelled') {
      return;
    }

    const year = item.starttime.split('-')[0];
    const month = item.starttime.split('-')[1];
    const day = item.starttime.split('-')[2].split('T')[0];
    const startTime = item.starttime.split('-')[2].split('T')[1].substring(0, 5); 
    const weekday = weekdayArr[new Date(item.starttime).getDay()];
    let endTime = new Date(item.starttime);
    endTime.setMinutes(new Date(item.starttime).getMinutes() + item.durationminutes);
    endTime = endTime.toUTCString().split(' ')[4].substring(0, 5);

    return (
      // <Swipeout right={swipeoutBtns} autoClose sensitivity={1000}>
        <View style={styles.eventContainer}>
          <View style={styles.shadowBox}>
            <View style={styles.infoBoxContainer}>
              <Avatar
                containerStyle={styles.avatarContiner}
                rounded
                size={60}
                source={{ uri: item.avatar }}
              />
              <View style={[styles.textLeftAlign , {
                  overflow: 'hidden',
                  flexShrink: 1,
                  marginRight: 20,
              }]}>
                <View>
                  <Text style={styles.titleText}>{item.businessname}</Text>
                </View>
                <View>
                  <Text style={styles.serviceText}>{item.servicename}</Text>
                </View>
                <View>
                  <Text style={styles.dateText}>{weekday} | {day}.{month}.{year}</Text>
                </View>
                <View>
                  <Text style={styles.dateText}>{startTime} - {endTime}</Text>
                </View>
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.getDirectionsContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isPopupVisble: true, itemPressed: item })
                }}
                style={styles.getDirectionsButtonContainer}
              >
                <MaterialCommunityIcons
                  name="directions"
                  size={25}
                  color={colors.blue}
                  style={styles.getDirectionsIcon}
                />
                <Text style={styles.getDirectionsText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      // </Swipeout>
    )
  }

  renderOrdersList() {
    return (
      <FlatList data={this.props.ordersList} renderItem={this.renderRow} keyExtractor={(item, index) => index.toString()}/>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.flexContainer}>
        <View style={styles.flexContainer}>
            <Text style={styles.heading}>My Orders</Text>
            {this.props.ordersList.length === 0 ? this.renderEmptySchedule() : this.renderOrdersList()}
            <Popup
              isVisible={this.state.isPopupVisble}
              onCancelPressed={() => this.setState({ isPopupVisble: false })}
              onAppPressed={() => this.setState({ isPopupVisble: false })}
              onBackButtonPressed={() => this.setState({ isPopupVisble: false })}
              modalProps={{ animationIn: 'slideInUp' }}
              appsWhiteList={[]}
              options={{
                alwaysIncludeGoogle: true,
                latitude: this.state.itemPressed.lat,
                longitude: this.state.itemPressed.lng,
                title: `${this.state.itemPressed.street}, ${this.state.itemPressed.city}`,
                dialogTitle: 'Open With',
                cancelText: 'Cancel'
              }}
            />
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
    ordersList: Customer.ordersList
  }
}

export default connect(mapStateToProps)(MyOrdersScreen);