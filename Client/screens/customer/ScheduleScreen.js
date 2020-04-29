import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Divider, Avatar } from 'react-native-elements';
import styles from '../../styles/customer/Style_ScheduleScreen';
import database from '../../database';
import colors from '../../constants/Colors';
import Swipeout from 'react-native-swipeout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from "react-redux";

class ScheduleScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEmpty: false,
      scheduleList: database.bookedServices,
    }
    this.fetchOrdersList = this.fetchOrdersList.bind(this);
  }

  componentDidMount() {
    this.fetchOrdersList();
  }

  async fetchOrdersList() {
    const url = 'http://192.168.1.198:3000/order/getAllCustomerOrders';
    const options = { 
      method: 'POST', 
      headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
      },
      body: JSON.stringify({userID: this.props.currentUser.userid})
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(async data => {
        console.log(data);
        this.setState({scheduleList: data});
      })
      .catch(error => console.log(error))
  }

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
    const swipeoutBtns = [
      {
        text: 'Delete',
        type: 'delete',
        backgroundColor: 'red',
        underlayColor: colors.lightBlack,
        // onPress: () => this.handleDeletePress(item)
      }
    ]

    // console.log(item.Pictures.Avatar);

    return (
      // <Swipeout right={swipeoutBtns} autoClose sensitivity={1000}>
        <View style={styles.eventContainer}>
          <View style={styles.shadowBox}>
            <View style={styles.infoBoxContainer}>
              <Avatar
                containerStyle={styles.avatarContiner}
                rounded
                size={60}
                source={{ uri: item.Avatar }}
              />
              <View style={styles.textLeftAlign}>
                <View>
                  <Text style={styles.titleText}>{item.BusinessName}</Text>
                </View>
                <View>
                  <Text style={styles.serviceText}>{item.ServiceName}</Text>
                </View>
                <View>
                  <Text style={styles.dateText}>{item.Date}</Text>
                </View>
                <View>
                  <Text style={styles.dateText}>{item.Time}</Text>
                </View>
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.getDirectionsContainer}>
              <TouchableOpacity
                // onPress={() => {
                //   this.setState({ isPopupVisble: true, itemPressed: item })
                // }}
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

  renderScheduleList() {
    const { scheduleList } = this.state
    return (
      <FlatList data={scheduleList} renderItem={this.renderRow} keyExtractor={(item, index) => index.toString()} />
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.flexContainer}>
        <View style={styles.flexContainer}>
            {/* <Text style={styles.heading}>My Schedule</Text> */}
            <Text style={styles.heading}>My Orders</Text>
            {this.state.isEmpty === true ? this.renderEmptySchedule() : this.renderScheduleList()}
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ User, Customer }) => {
  return {
    hasBusiness: User.hasBusiness,
    currentUser: User.currentUser,
    favoritesList: Customer.favoritesList
  }
}

export default connect(mapStateToProps)(ScheduleScreen);