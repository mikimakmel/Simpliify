import React, { Component, Children } from 'react';
import { View, Text, ScrollView, FlatList, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { ListItem, Button, Overlay } from 'react-native-elements';
import colors from '../../constants/Colors';
import styles from '../../styles/customer/Style_BookingScreen';
import * as Calendar from 'expo-calendar';
import * as Permissions from 'expo-permissions';
import moment from 'moment';
import database from '../../database';
import { connect } from "react-redux";
import * as Actions_Customer from '../../redux/actions/Actions_Customer';
import route from '../../routeConfig';
import { MaterialCommunityIcons, Entypo, Fontisto } from '@expo/vector-icons';

class BookingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessData: this.props.route.params.businessData,
      serviceData: this.props.route.params.serviceData,
      currentOrder: {},
      overlayVisible: false,
      selectedDate: null,
      prettyDate: null,
      availableHours: [],
      isLoading: true
    };
    this.onDayPress = this.onDayPress.bind(this);
    this.handleBooking = this.handleBooking.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.createNewOrder = this.createNewOrder.bind(this);
    this.renderOverlay = this.renderOverlay.bind(this);
    this.initDate = this.initDate.bind(this);
    this.getTime = this.getTime.bind(this);
    this.fetchAvailableHours = this.fetchAvailableHours.bind(this);
    this.saveToDeviceCalendar = this.saveToDeviceCalendar.bind(this);
    this._getCalendarPermissionAsync = this._getCalendarPermissionAsync.bind(this);
    this.sendPushNotification = this.sendPushNotification.bind(this);
  }

  componentDidMount() {
    this.initDate();
    this._getCalendarPermissionAsync();
  }

  async _getCalendarPermissionAsync() {
    const { status } = await Permissions.askAsync(Permissions.CALENDAR);
    if (status !== 'granted') {
      alert('Sorry, we need location permissions to make this work!');
    }
  }

  async saveToDeviceCalendar() {
    const {currentOrder} = this.state; 

    let endTime = new Date(currentOrder.starttime);
    endTime.setMinutes(new Date(currentOrder.starttime).getMinutes() + currentOrder.durationminutes);

    const eventDetails = {
      startDate: currentOrder.starttime,
      endDate: endTime,
      location: `${currentOrder.street}, ${currentOrder.city}.`,
      timeZone: 'GMT+3',
      title: `${currentOrder.servicename} at ${currentOrder.businessname}`
    }

    const calendars = await Calendar.getCalendarsAsync();
    try {
      await Calendar.createEventAsync(calendars.filter((item) => item.allowsModifications === true)[0].id, eventDetails);
    } catch (error) {
      console.log('Error', error);
    }
  }

  async fetchAvailableHours(day) {
    await this.setState({isLoading: true});
    const { businessData, serviceData } = this.state;

    const url = `${route}/order/getAllAvailableBusinessTime`;
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        currentDate: day,
        businessID: businessData.business.businessid,
        durationMinutes: serviceData.durationminutes
      })
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        this.setState({availableHours: data});
      })
      .catch(error => console.log(error))

    await this.setState({isLoading: false});
  }

  initDate() {
    let Tday = new Date().getDate().toString();
    let Tmonth = (new Date().getMonth() + 1).toString();
    let Tyear = new Date().getFullYear().toString();
    if (Tmonth.length < 2) {
      Tmonth = '0' + Tmonth
    }
    if (Tday.length < 2) {
      Tday = '0' + Tday
    }
    const TfullDate = Tyear.toString() + '-' + Tmonth.toString() + '-' + Tday.toString();
    let pretty = Tday.toString() + '/' + Tmonth.toString() + '/' + Tyear.toString();
    this.setState({ selectedDate: TfullDate, prettyDate: pretty });

    this.fetchAvailableHours(TfullDate);
  }

  onDayPress(day) {
    let d, m;

    if (day.day.toString().length < 2) {
      d = '0' + day.day.toString();
    }
    else {
      d = day.day.toString();
    }
    if (day.month.toString().length < 2) {
      m = '0' + day.month.toString();
    } 
    else {
      m = day.month.toString();
    }

    let pretty = d + '/' + m + '/' + day.year.toString();
    this.setState({ selectedDate: day.dateString, prettyDate: pretty });

    this.fetchAvailableHours(day.dateString);
  }

  handleBooking(item) {
    Alert.alert(
      'Are you sure?',
      `Booking ${this.props.route.params.serviceData.name} at ${item.time}`,
      [
        {
          text: 'Yes',
          onPress: () => {
            this.createNewOrder(item);
            this.setState({ overlayVisible: true });
          }
        },
        { 
          text: 'Cancel',
        }
      ]
    )
  }

  async createNewOrder(item) {
    const { businessData, serviceData } = this.state;
    
    const url = `${route}/order/createNewOrder`;
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        userID: this.props.currentUser.userid,
        businessID: businessData.business.businessid,
        serviceID: serviceData.serviceid,
        startTime: `${this.state.selectedDate} ${item.time}`,
        durationMinutes: serviceData.durationminutes
      })
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if(data === 'Unfortunately this has been already booked. Please try a different booking') {
          alert('Unfortunately this has been already booked. \nPlease try a different booking');
        } else {
          let order = {
            businessid: businessData.business.businessid,
            manager: businessData.business.manager,
            businessname: businessData.business.name,
            avatar: businessData.business.avatar,
            street: businessData.business.street,
            city: businessData.business.city,
            country: businessData.business.country,
            lat: businessData.business.coordinates.x,
            lng: businessData.business.coordinates.y,
            customerid: this.props.currentUser.userid,
            orderid: data.orderid,
            serviceid: serviceData.serviceid,
            servicename: serviceData.name,
            durationminutes: serviceData.durationminutes,
            starttime: data.starttime,
            orderedat: data.orderedat,
            status: data.status,
          }
          this.setState({currentOrder: order});
          this.props.dispatch(Actions_Customer.addToOrdersList(order));
          this.sendPushNotification(order);
        }
      })
      .catch(error => console.log(error))
  }

  async sendPushNotification(order) {
    var manager_push_token = '';
    const url = `${route}/user/getUserPushToken`;
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({userID: order.manager})
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        manager_push_token = data.push_token;
      })
      .catch(error => console.log(error))

    const year = order.starttime.split('-')[0];
    const month = order.starttime.split('-')[1];
    const day = order.starttime.split('-')[2].split('T')[0];
    const startTime = order.starttime.split('-')[2].split('T')[1].substring(0, 5); 
    
    const message = {
      to: manager_push_token,
      sound: 'default',
      title: 'You have a new order!',
      body: `For ${order.servicename} at ${day}/${month}/${year} ${startTime}`,
      data: { data: 'goes here' },
      _displayInForeground: true,
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };

  getTime(dateAndTime) {
    return dateAndTime.toString().substring(11, 16);
  }

  renderOverlay() {
    if(this.state.currentOrder.businessname) {
      return (
        <Overlay isVisible={this.state.overlayVisible} fullScreen>
          <View style={styles.overlayContainer}>
            <Image style={styles.overlaySucess} source={require('../../assets/images/success.png')} />
            <Text style={styles.overlayHeadingText}>You are all booked!</Text>
            <View style={{alignItems: 'flex-start', justifyContent: 'center'}}>

              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
                <Fontisto
                  name="shopping-bag-1"
                  size={25}
                  color={colors.red}
                  style={{marginRight: 15}}
                />
                <Text style={styles.overlayText}>{this.state.currentOrder.servicename}</Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
                <Entypo
                  name="location-pin"
                  size={25}
                  color={colors.red}
                  style={{marginRight: 15}}
                />
                <Text style={styles.overlayText}>{this.state.currentOrder.street}, {this.state.currentOrder.city}.</Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={25}
                  color={colors.red}
                  style={{marginRight: 15}}
                />
                <Text style={styles.overlayText}>
                  {this.state.prettyDate} at {this.getTime(this.state.currentOrder.starttime)}
                </Text>
              </View>

            </View>
            <View style={{alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 100}}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ overlayVisible: false });
                  this.props.navigation.goBack();
                  this.props.navigation.navigate('Schedule');
                  this.saveToDeviceCalendar();
                }}
              >
                <Text style={styles.overlaySaveButton}>Save to My Device Calandar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ overlayVisible: false });
                  this.props.navigation.goBack();
                  this.props.navigation.navigate('Schedule');
                }}
              >
                <Text style={styles.overlayDontSaveButton}>Don't Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Overlay>
      )
    }
  }

  renderRow({ item }) {
    return (
      <View>
        <ListItem
          title={item.time}
          titleStyle={styles.ListTitle}
          bottomDivider
          checkmark={
            <Button
              buttonStyle={styles.ButtonStyling}
              titleStyle={styles.ButtonTitleStyling}
              containerStyle={styles.ButtonContainer}
              type="outline"
              title="Book"
              onPress={() => this.handleBooking(item)}
            />
          }
        />
      </View>
    );
  }

  renderResults() {
    if(this.state.availableHours.length > 0) {
      return(
        <FlatList
          data={this.state.availableHours}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
      )
    } 
    else {
      return(
        <Text style={{fontSize: 16, alignSelf: 'center', marginTop: 80}}>There are no available slots left.</Text>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <CalendarList
          horizontal
          pagingEnabled
          style={styles.calendar}
          minDate={Date()}
          onDayPress={this.onDayPress}
          markingType={'custom'}
          markedDates={{ 
            [this.state.selectedDate]: {
              customStyles: {
                container: { backgroundColor: colors.red },
                text: { color: colors.white }
              }
            }
          }}
        />
        <Text style={styles.text}>{this.state.prettyDate}</Text>
        {
          !this.state.isLoading ? this.renderResults() :
          <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: colors.white }}>
            <ActivityIndicator size="large" color={colors.red}/>
          </View>
        }
        {this.renderOverlay()}
      </View>
    );
  }
}

const mapStateToProps = ({ User, Customer }) => {
  return {
    hasBusiness: User.hasBusiness,
    currentUser: User.currentUser,
    favoritesList: Customer.favoritesList,
    ordersList: Customer.Customer
  }
}

export default connect(mapStateToProps)(BookingScreen);
