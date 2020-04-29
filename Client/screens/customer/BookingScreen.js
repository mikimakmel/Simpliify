import React, { Component } from 'react';
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

class BookingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        businessData: this.props.route.params.businessData,
        serviceData: this.props.route.params.serviceData,
        currentBook: {},
        eventDetails: {},
        overlayVisible: false
    };
    this.onDayPress = this.onDayPress.bind(this);
    this.handleBookButtonPressed = this.handleBookButtonPressed.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.createNewOrder = this.createNewOrder.bind(this);
    this.renderOverlay = this.renderOverlay.bind(this);
  }

  componentDidMount() {
    const Tday = new Date().getDate().toString();
    let Tmonth = (new Date().getMonth() + 1).toString();
    const Tyear = new Date().getFullYear().toString();
    if (Tmonth.length < 2) {
      Tmonth = '0' + Tmonth
    }
    const TfullDate = Tyear + '-' + Tmonth.toString() + '-' + Tday.toString();
    this.setState({ selected: TfullDate, currentDay: TfullDate });
  }

  onDayPress(day) {
    this.setState({ selected: day.dateString });
  }

  handleBookButtonPressed(item) {
    Alert.alert(
      'Are you sure?',
      `Booking ${this.state.serviceData.Name} at ${item.Time}`,
      [
        {
          text: 'Yes',
          onPress: () => {
            this.createNewOrder(item);
            // this.setState({ overlayVisible: true })
          }
        },
        { text: 'Cancel' }
      ],
      { cancelable: false }
    )
  }

  async createNewOrder(item) {
    const test_businessData = database.businesses[0];
    const { businessData, serviceData } = this.state;
    // console.log(businessData)

    const order = {
      userID: this.props.currentUser.userid,
      businessID: businessData.businessid,
      serviceID: 12,
      startTime: `${this.state.selected} ${item.Time}`,
    }
    
    const url = 'http://192.168.1.198:3000/order/createNewOrder';
    const options = { 
      method: 'POST', 
      headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
      },
      body: JSON.stringify({order: order})
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(async data => {
        console.log(data)
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
    // console.log(item)

    return (
      <View>
        <ListItem
          title={item.Time}
          titleStyle={styles.ListTitle}
          // subtitle={item.Hosting}
          // subtitleStyle={styles.ListSubtitle}
          bottomDivider
          checkmark={
            <Button
              buttonStyle={styles.ButtonStyling}
              titleStyle={styles.ButtonTitleStyling}
              containerViewStyle={{ witdh: 70 }}
              type="outline"
              large
              title="Book"
              onPress={() => this.handleBookButtonPressed(item)}
            />
          }
        />
      </View>
    )
  }

  render() {
    // console.log(this.state.serviceData);
    
    return (
        <View style={styles.container}>
            <CalendarList
            horizontal
            pagingEnabled
            style={styles.calendar}
            minDate={Date()}
            onDayPress={this.onDayPress}
            // onMonthChange={(month) => {console.log('month changed', month)}}
            markingType={'custom'}
            markedDates={{
                [this.state.selected]: {
                customStyles: {
                    container: {
                    backgroundColor: colors.red
                    },
                    text: {
                    color: 'white'
                    }
                }
                },
                '2019-07-19': {
                customStyles: {
                    text: {
                    color: 'white'
                    }
                }
                }
            }}
            />
            <Text style={styles.text}>{this.state.selected}</Text>
            <ScrollView>
            <FlatList
              data={this.state.serviceData.Availability}
              renderItem={this.renderRow}
              keyExtractor={(item, index) => index.toString()}
            />
            </ScrollView>
            {/* {this.renderOverlay()} */}
        </View>
    );
  }
}

const mapStateToProps = ({ User, Customer }) => {
  return {
    hasBusiness: User.hasBusiness,
    currentUser: User.currentUser,
    favoritesList: Customer.favoritesList
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