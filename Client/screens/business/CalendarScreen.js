import React, { Component } from 'react';
import { Text, Alert, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, View } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { ListItem } from 'react-native-elements';
import PhoneCall from 'react-native-phone-call';
import { Popup } from 'react-native-map-link';
var moment = require('moment');
import colors from '../../constants/Colors';
import styles from '../../styles/business/Style_CalendarScreen';

class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      BusinessID: 13,
      items: {},
      isPopupVisble: false,
      isLoading: true,
      orders: null
    };
    this.fetchAllOrders = this.fetchAllOrders.bind(this);
  }

  componentDidMount() {
    this.fetchAllOrders();
  }

  async fetchAllOrders() {
    const { BusinessID } = this.state;

    const url = `${route}/order/getAllBusinessOrders`;
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({businessID: BusinessID})
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        this.setState({orders: data});
      })
      .catch(error => console.log(error))

    this.setState({isLoading: false});
    this.MapOrders();
  }

  MapOrders() {
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
    const { isLoading } = this.state;

    if(isLoading) {
      return(
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: colors.white }}>
          <ActivityIndicator size="large" color={colors.red}/>
        </View>
      )
    }
    else {
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
}

export default CalendarScreen;
