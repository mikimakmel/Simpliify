import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Button, Overlay } from 'react-native-elements';
import colors from '../../constants/Colors';
import styles from '../../styles/customer/Style_BookingScreen';

class BookingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {}
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
export default BookingScreen;

// item: {
//   backgroundColor: 'white',
//   flex: 1,
//   borderRadius: 15,
//   padding: 10,
//   marginRight: 10,
//   marginTop: 17
// },
