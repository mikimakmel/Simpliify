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

class MyOrdersScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPopupVisble: false,
      itemPressed: {}
    }
    this.fetchOrdersList = this.fetchOrdersList.bind(this);
    this.renderEmptySchedule = this.renderEmptySchedule.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderOrdersList = this.renderOrdersList.bind(this);
    this.fetchBusinessAndAddOrderToList = this.fetchBusinessAndAddOrderToList.bind(this);
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
        // console.log(data);
        // this.setState({ordersList: data});
        data.map((item) => {
          // console.log(item.business)
          this.fetchBusinessAndAddOrderToList(item);
        })
      })
      .catch(error => console.log(error))
  }

  async fetchBusinessAndAddOrderToList(order) {
    // console.log(order)
    const url = 'http://192.168.1.198:3000/business/getBusinessByID';
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({businessID: order.business})
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(async data => {
        if (!this.isOrderInList(order.orderid)) {
          let orderWithBusiness = {
            business: data,
            order: order
          }
          // console.log(orderWithBusiness);
          this.props.dispatch(Actions_Customer.addToOrdersList(orderWithBusiness));
        }
      })
      .catch(error => console.log(error))
  }

  isOrderInList(orderID) {
    this.props.ordersList.map((item) => {
      // console.log(orderID, item)
      if(item.order.orderid === orderID) {
        return true;
      }
    });

    return false;
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
    // const swipeoutBtns = [
    //   {
    //     text: 'Delete',
    //     type: 'delete',
    //     backgroundColor: 'red',
    //     underlayColor: colors.lightBlack,
    //     // onPress: () => this.handleDeletePress(item)
    //   }
    // ]

    // console.log(item.Pictures.Avatar);
    // console.log(item);
    const year = item.order.starttime.split('-')[0];
    const month = item.order.starttime.split('-')[1];
    const day = item.order.starttime.split('-')[2].split('T')[0];
    const startTime = item.order.starttime.split('-')[2].split('T')[1].substring(0, 5); 

    const weekdayArr = new Array(7);
    weekdayArr[0] = "Sunday";
    weekdayArr[1] = "Monday";
    weekdayArr[2] = "Tuesday";
    weekdayArr[3] = "Wednesday";
    weekdayArr[4] = "Thursday";
    weekdayArr[5] = "Friday";
    weekdayArr[6] = "Saturday";
    const weekday = weekdayArr[new Date(item.order.starttime).getDay()];

    return (
      // <Swipeout right={swipeoutBtns} autoClose sensitivity={1000}>
        <View style={styles.eventContainer}>
          <View style={styles.shadowBox}>
            <View style={styles.infoBoxContainer}>
              <Avatar
                containerStyle={styles.avatarContiner}
                rounded
                size={60}
                source={{ uri: item.business.avatar }}
              />
              <View style={[styles.textLeftAlign , {
                  overflow: 'hidden',
                  flexShrink: 1,
                  marginRight: 20,
              }]}>
                <View>
                  <Text style={styles.titleText}>{item.business.name}</Text>
                </View>
                <View>
                  {/* <Text style={styles.serviceText}>{item.ServiceName}</Text> */}
                  <Text style={styles.serviceText}>Service Name</Text>
                </View>
                <View>
                  <Text style={styles.dateText}>{weekday} | {day}.{month}.{year}</Text>
                </View>
                <View>
                  <Text style={styles.dateText}>{startTime} - {startTime}</Text>
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
    const { ordersList } = this.props;
    // console.log(ordersList[0]);
    return (
      <FlatList data={ordersList} renderItem={this.renderRow} keyExtractor={(item, index) => index.toString()} />
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
                latitude: 32.0904312,
                longitude: 34.8024365,
                title: this.state.itemPressed.Address,
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