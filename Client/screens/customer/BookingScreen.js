import React, { Component, Children } from 'react';
import { View, Text, ScrollView, FlatList, Alert, TouchableOpacity, AsyncStorage } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { ListItem, Button, Overlay } from 'react-native-elements';
import colors from '../../constants/Colors';
import styles from '../../styles/customer/Style_BookingScreen';
// import * as Calendar from 'expo-calendar';
// import * as Permissions from 'expo-permissions';
import moment from 'moment';
import database from '../../database';
import { connect } from "react-redux";
import * as Actions_Customer from '../../redux/actions/Actions_Customer';

const openHours = [
  { time: '08:00' },
  { time: '09:00' },
  { time: '10:00' },
  { time: '11:00' },
  { time: '12:00' },
  { time: '13:00' },
];

class BookingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        businessData: this.props.route.params.businessData,
        serviceData: this.props.route.params.serviceData,
        currentBook: {},
        eventDetails: {},
        overlayVisible: false,
        selectedDate: null,
        prettyDate: null,
    };
    this.onDayPress = this.onDayPress.bind(this);
    this.handleBooking = this.handleBooking.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.createNewOrder = this.createNewOrder.bind(this);
    this.renderOverlay = this.renderOverlay.bind(this);
    this.initDate = this.initDate.bind(this);
  }

  componentDidMount() {
    this.initDate();
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
  }

  handleBooking(item) {
    Alert.alert(
      'Are you sure?',
      `Booking ${this.props.route.params.serviceData.name} at ${item.time}`,
      [
        {
          text: 'Yes',
          onPress: () => this.createNewOrder(item)
          // onPress: async () => {
          //   // this.setState({ overlayVisible: true })
          //   await this.createNewOrder(item);
          // }
        },
        { 
          text: 'Cancel',
        }
      ],
      // { cancelable: false }
    )
  }

  async createNewOrder(item) {
    const { businessData, serviceData } = this.state;
    
    const url = 'http://192.168.1.198:3000/order/createNewOrder';
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
        startTime: `${this.state.selectedDate} ${item.time}`
      })
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        let order = {
          businessid: businessData.business.businessid,
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

        this.props.dispatch(Actions_Customer.addToOrdersList(order));
      })
      .catch(error => console.log(error))
  }

  renderOverlay() {
    return (
      <Overlay isVisible={this.state.overlayVisible} fullScreen>
        <View style={styles.overlayContainer}>
          <Text style={styles.overlayHeadingText}>Booking Information:</Text>
          <Text style={styles.overlayText}>{this.state.eventDetails.BusinessName}</Text>
          <Text style={styles.overlayText}>{this.state.eventDetails.ServiceName}</Text>
          <Text style={styles.overlayText}>{this.state.eventDetails.Date}</Text>
          <Text style={styles.overlayText}>{this.state.eventDetails.Time}</Text>
          <Text style={styles.overlayText}>{this.state.eventDetails.Address}</Text>
          <TouchableOpacity
            onPress={() => {
              this.setState({ overlayVisible: false })
              this.props.navigation.goBack()
              this.props.navigation.navigate('Schedule')
              this.saveToDeviceCalendar()
            }}
          >
            <Text style={styles.overlaySaveButton}>Save to My Device Calandar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ overlayVisible: false })
              this.props.navigation.goBack()
              this.props.navigation.navigate('Schedule')
            }}
          >
            <Text style={styles.overlayDontSaveButton}>{"Don't Save"}</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    )
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
        <FlatList
          data={openHours}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
        {/* {this.renderOverlay()} */}
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


    // const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // let endingTime = moment(`${this.state.selected} ${item.Time}`).format('HH:mm');

    // const duration = serviceData.Duration.split(' ');
    // if (serviceData.Duration.includes('Hrs')) {
    //   endingTime = moment(`${this.state.selected} ${item.Time}`).add(duration[0], 'hours').format('HH:mm');
    // } else {
    //   endingTime = moment(`${this.state.selected} ${item.Time}`).add(duration[0], 'minutes').format('HH:mm');
    // }

    // const order = {
    //   BusinessID: businessData.businessid,
    //   BusinessName: businessData.name,
    //   ServiceName: serviceData.Name,
    //   Avatar: test_businessData.Pictures.Favorite,
    //   Date: `${days[new Date(this.state.selected).getDay()]} | ${new Date(
    //     this.state.selected
    //   ).getDate()}.${new Date(this.state.selected).getMonth() + 1}.${new Date(
    //     this.state.selected
    //   ).getFullYear()}`,
    //   Time: `${item.Time} - ${endingTime}`,
    //   Address: test_businessData.Location.Address
    // }

    // console.log(order);

    // AsyncStorage.getItem('Schedule', (err, result) => {
    //   let arr = []
    //   if (JSON.parse(result) !== null) arr = JSON.parse(result)
    //   arr.push(event)
    //   return AsyncStorage.setItem('Schedule', JSON.stringify(arr))
    // })

    // this.setState({ currentItem: item, eventDetails: event })
