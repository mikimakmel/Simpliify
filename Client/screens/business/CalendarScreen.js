import React, { Component } from 'react';
import { Text, Alert, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { ListItem, Rating, Overlay } from 'react-native-elements';
import { View } from 'react-native-animatable';
import PhoneCall from 'react-native-phone-call';
import { Popup } from 'react-native-map-link';
var moment = require('moment');
import colors from '../../constants/Colors';
import styles from '../../styles/business/Style_CalendarScreen';

class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      isPopupVisble: false,
      orders: [
        {
              "status": "Cancelled",
              "starttime": "2020-04-17T01:38:22.000Z",
              "endtime": "2020-04-16T23:08:22.000Z",
              "name": "Jarvis Flatt",
              "service": "Sports Services",
              "phone": "0548843282",
              "address": "15 Yetzira, Rehovot"
          },
          {
              "status": "Success",
              "starttime": "2020-04-17T08:16:07.000Z",
              "endtime": "2020-04-17T05:46:07.000Z",
              "name": "Cristin Jeremiah",
              "service": "Beauty Product Management",
              "phone": "0502996001",
              "address": "5 Hashalom, Tel Aviv"
          },
          {
              "status": "Success",
              "starttime": "2020-04-18T07:22:03.000Z",
              "endtime": "2020-04-18T05:52:03.000Z",
              "name": "Claudianus Peealess",
              "service": "Jewelery Legal",
              "phone": "0504512360",
              "address": "98 Rabbi Akiva, Bnei Brak"
          },
          {
              "status": "Success",
              "starttime": "2020-05-05T14:00:00.000Z",
              "endtime": "2020-05-05T12:00:00.000Z",
              "name": "Sarena Blinde",
              "service": "Grocery Legal",
              "phone": "0506156522",
              "address": "18 Hachalutzim, Tel Aviv"
          },
          {
              "status": "Success",
              "starttime": "2020-05-05T15:00:00.000Z",
              "endtime": "2020-05-05T13:00:00.000Z",
              "name": "Sarena Blinde",
              "service": "Grocery Legal",
              "phone": "0506156522",
              "address": "18 Hachalutzim, Tel Aviv"
          },
          {
              "status": "Cancelled",
              "starttime": "2020-05-05T16:56:59.000Z",
              "endtime": "2020-05-05T14:26:59.000Z",
              "name": "Carry Damarell",
              "service": "Sports Research and Development",
              "phone": "0505965707",
              "address": "94 Em Hamoshavot, Petah Tikva"
          },
          {
              "status": "Success",
              "starttime": "2020-05-11T14:09:55.000Z",
              "endtime": "2020-05-11T12:39:55.000Z",
              "name": "Dulciana Humpage",
              "service": "Music Legal",
              "phone": "0504799763",
              "address": "15 Yetzira, Rehovot"
          },
          {
              "status": "Success",
              "starttime": "2020-05-23T13:00:00.000Z",
              "endtime": "2020-05-23T11:30:00.000Z",
              "name": "Miki Makmel",
              "service": "Jewelery Legal",
              "phone": "0525368689",
              "address": "HaKishon, Tel Aviv"
          },
          {
              "status": "Success",
              "starttime": "2020-05-23T14:30:00.000Z",
              "endtime": "2020-05-23T13:00:00.000Z",
              "name": "Miki Makmel",
              "service": "Jewelery Legal",
              "phone": "0525368689",
              "address": "HaKishon, Tel Aviv"
          },
          {
              "status": "Success",
              "starttime": "2020-05-23T16:09:01.000Z",
              "endtime": "2020-05-23T14:09:01.000Z",
              "name": "Lovell Sellor",
              "service": "Kids Training",
              "phone": "0544595363",
              "address": "12 Harab Lewin, Afula"
          },
          {
              "status": "Success",
              "starttime": "2020-05-24T06:51:50.606Z",
              "endtime": "2020-05-24T05:21:50.606Z",
              "name": "Miki Makmel",
              "service": "Jewelery Legal",
              "phone": "0525368689",
              "address": "HaKishon, Tel Aviv"
          },
          {
              "status": "Cancelled",
              "starttime": "2020-05-25T13:20:21.696Z",
              "endtime": "2020-05-25T11:50:21.696Z",
              "name": "Miki Makmel",
              "service": "Jewelery Legal",
              "phone": "0525368689",
              "address": "HaKishon, Tel Aviv"
          },
          {
              "status": "Confirmed",
              "starttime": "2020-05-26T12:00:00.000Z",
              "endtime": "2020-05-26T10:30:00.000Z",
              "name": "Miki Makmel",
              "service": "Music Legal",
              "phone": "0525368689",
              "address": "HaKishon, Tel Aviv"
          },
          {
              "status": "Success",
              "starttime": "2020-05-26T13:30:00.000Z",
              "endtime": "2020-05-26T12:00:00.000Z",
              "name": "Miki Makmel",
              "service": "Music Legal",
              "phone": "0525368689",
              "address": "HaKishon, Tel Aviv"
          },
          {
              "status": "Confirmed",
              "starttime": "2020-05-28T15:00:00.000Z",
              "endtime": "2020-05-28T13:30:00.000Z",
              "name": "Miki Makmel",
              "service": "Jewelery Legal",
              "phone": "0525368689",
              "address": "HaKishon, Tel Aviv"
          },
          {
              "status": "Confirmed",
              "starttime": "2020-05-28T16:30:00.000Z",
              "endtime": "2020-05-28T15:00:00.000Z",
              "name": "Miki Makmel",
              "service": "Jewelery Legal",
              "phone": "0525368689",
              "address": "HaKishon, Tel Aviv"
        }]
    };
  }

  componentDidMount() {
    this.fetchAllOrders();
  }

  fetchAllOrders() {
    let temp = this.state.items;
    this.state.orders.map((item) => {
      let start = moment(item.starttime).format('HH:mm')
      let end = moment(item.endtime).format('HH:mm')
      let duration = end.concat(' - ', start)

      if(!temp[moment(item.starttime).format('YYYY-MM-DD')])
        temp[moment(item.starttime).format('YYYY-MM-DD')] = []

        temp[moment(item.starttime).format('YYYY-MM-DD')].push({
          name: item.name,
          service: item.service,
          time: duration,
          status: item.status,
          phone: item.phone,
          address: item.address  
        })
      
    })
      this.setState({items: temp})
  }

  loadItems(day) {
    setTimeout(() => {
      const newItems = this.state.items;
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!newItems[strTime]) {
          newItems[strTime] = [];
        }
      }
      Object.keys(newItems).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({items: newItems});
    }, 1000);
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  renderItem(item) {
    let statusColor = colors.blue;
    if(item.status === 'Cancelled') {
      statusColor = colors.red;
    }
    else if(item.status === 'Success') {
      statusColor = colors.green03;
    }

    return (
      <TouchableOpacity 
        style={[styles.item, {opacity: item.status !== 'Confirmed' ? 0.8 : 1}]} 
        onPress={() => Alert.alert('Contact Customer', '',
        [
            {
              text: 'Call - ' + item.phone,
              onPress: () => {
              const args = {
                number: item.phone,
                prompt: false
              }
              PhoneCall(args).catch(console.error)
            }
            },
            {
              text: 'Navigate - ' + item.address,
              onPress: () => this.setState({ isPopupVisble: true })
            },
            { text: 'Cancel', onPress: () => console.log('OK Pressed'), style: 'cancel' }
        ],
        { cancelable: false }
        )} 
      >
        <ListItem
          title={item.service}
          titleStyle={{fontSize: 16, fontWeight: '500', color: colors.lightBlack, marginBottom: 5}}
          subtitle={item.time}
          subtitleStyle={{fontSize: 14, fontWeight: '400', color: colors.gray02}}
          rightElement={<Text style={{fontSize: 13, fontWeight: '300', color: colors.gray02}}>{item.name}</Text>}
        />
        <View style={{backgroundColor: statusColor, height: 2, width: '90%', borderRadius: 10, alignSelf: 'center', marginTop: 5}}/>
        {item.status === 'Confirmed' ? null : this.renderStatusIcon(item)}
      <Popup
            isVisible={this.state.isPopupVisble}
            onCancelPressed={() => this.setState({ isPopupVisble: false })}
            onAppPressed={() => this.setState({ isPopupVisble: false })}
            onBackButtonPressed={() => this.setState({ isPopupVisble: false })}
            modalProps={{ animationIn: 'slideInUp' }}
            appsWhiteList={[]}
            options={{
              alwaysIncludeGoogle: true,
              latitude: 32.1563346,
              longitude: 34.8814187,
              title: item.address,
              dialogTitle: `${item.address}`,
              cancelText: 'Cancel'
            }}
          />
      </TouchableOpacity>
    );
  }

  renderStatusIcon(item) {
    if(item.status === 'Cancelled') {
      return(
        <View style={styles.statusIcon}>
          <Text style={styles.statusText, {color: colors.red}}>Cancelled</Text>
        </View>
      )
    }
    if(item.status === 'Success') {
      return(
        <View style={styles.statusIcon}>
          <Text style={styles.statusText, {color: colors.green03}}>Paid</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar barStyle="dark-content"/>
        <Agenda
          style={styles.calendar}
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          renderItem={this.renderItem.bind(this)}
          theme={{
            backgroundColor: colors.gray01,
            agendaKnobColor: colors.red,
            dotColor: colors.lightBlack,
            selectedDayBackgroundColor: colors.red,
          }}
        />
      </SafeAreaView>
    );
  }
}

export default CalendarScreen;
