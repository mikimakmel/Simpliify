import React, { Component } from 'react';
import { Text, Alert, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import colors from '../../constants/Colors';
import styles from '../../styles/business/Style_CalendarScreen';

class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      data: [
        {
            "orderid": "167",
            "customer": "214",
            "business": "1",
            "service": "167",
            "status": "Pending",
            "starttime": "2020-04-23T23:37:41.000Z",
            "orderedat": "2020-04-10T06:52:56.000Z"
        },
        {
            "orderid": "333",
            "customer": "279",
            "business": "1",
            "service": "333",
            "status": "Cancelled",
            "starttime": "2020-06-19T18:42:14.000Z",
            "orderedat": "2020-04-10T06:52:56.000Z"
        },
        {
            "orderid": "499",
            "customer": "844",
            "business": "1",
            "service": "499",
            "status": "Cancelled",
            "starttime": "2020-05-22T11:37:31.000Z",
            "orderedat": "2020-04-10T06:52:57.000Z"
        },
        {
            "orderid": "665",
            "customer": "747",
            "business": "1",
            "service": "665",
            "status": "Confirmed",
            "starttime": "2020-06-25T12:19:22.000Z",
            "orderedat": "2020-04-10T06:52:57.000Z"
        },
        {
            "orderid": "831",
            "customer": "798",
            "business": "1",
            "service": "831",
            "status": "Cancelled",
            "starttime": "2020-04-16T00:42:52.000Z",
            "orderedat": "2020-04-10T06:52:58.000Z"
        },
        {
            "orderid": "997",
            "customer": "777",
            "business": "1",
            "service": "997",
            "status": "Success",
            "starttime": "2020-06-27T04:43:07.000Z",
            "orderedat": "2020-04-10T06:52:58.000Z"
        },
        {
            "orderid": "1",
            "customer": "811",
            "business": "1",
            "service": "1",
            "status": "Pending",
            "starttime": "2020-04-21T02:05:43.000Z",
            "orderedat": "2020-04-10T06:52:56.000Z"
        },
        {
            "orderid": "1002",
            "customer": "1",
            "business": "1",
            "service": "1",
            "status": "Pending",
            "starttime": "2020-05-03T06:00:00.000Z",
            "orderedat": "2020-04-10T17:05:15.923Z"
        },
        {
            "orderid": "1021",
            "customer": "811",
            "business": "1",
            "service": "1",
            "status": "Success",
            "starttime": "2020-04-21T03:05:43.000Z",
            "orderedat": "2020-04-10T06:52:56.000Z"
        }
    ]
    };
  }

  render() {
    return (
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
    );
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
            this.state.items[strTime].push({
              name: 'Miki Makmel',
              service: 'Five Men Bukake',
              time: '14:30 - 16:00',
              secret: 'This thing took too much time...'
            });
            this.state.items[strTime].push({
              name: 'Shira Star',
              service: 'Guy Chriqui Special',
              time: '17:30 - 17:31',
              secret: 'This thing took too much time...'
            });
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  renderItem(item) {
    return (
      <TouchableOpacity 
        style={[styles.item]} 
        onPress={() => Alert.alert(item.secret)}
      >
        <Text>
          {item.name + '\n'}
          {item.service + '\n'}
          {item.time}
        </Text>
      </TouchableOpacity>
    );
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}
export default CalendarScreen;