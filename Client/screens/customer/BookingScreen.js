import React, { Component, Children } from 'react';
import { View, Text, ScrollView, FlatList, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
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
  }

  componentDidMount() {
    this.initDate();
  }

  async fetchAvailableHours(day) {
    await this.setState({isLoading: true});
    const { businessData, serviceData } = this.state;

    const url = 'http://192.168.1.198:3000/order/getAllAvailableBusinessTime';
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
        console.log(data)
        console.log('======================================================================')
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

        this.setState({currentOrder: order});
        this.props.dispatch(Actions_Customer.addToOrdersList(order));
      })
      .catch(error => console.log(error))
  }

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
            {/* <Text style={styles.overlayText}>{this.state.currentOrder.businessname}</Text> */}
            <Text style={styles.overlayText}>{this.state.currentOrder.servicename}</Text>
            <Text style={styles.overlayText}>{this.state.prettyDate}</Text>
            <Text style={styles.overlayText}>
              {this.state.prettyDate} at {this.getTime(this.state.currentOrder.starttime)}
            </Text>
            {/* <Text style={styles.overlayText}>{this.state.currentOrder.street}, {this.state.currentOrder.city}.</Text> */}
            <TouchableOpacity
              onPress={() => {
                console.log('SAVE')
                // this.setState({ overlayVisible: false })
                // this.props.navigation.goBack()
                // this.props.navigation.navigate('Schedule')
                // this.saveToDeviceCalendar()
              }}
            >
              <Text style={styles.overlaySaveButton}>Save to My Device Calandar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log('DONT SAVE')
                // this.setState({ overlayVisible: false })
                this.props.navigation.goBack()
                // this.props.navigation.navigate('Schedule')
              }}
            >
              <Text style={styles.overlayDontSaveButton}>Don't Save</Text>
            </TouchableOpacity>
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
