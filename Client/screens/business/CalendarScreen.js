import React, { Component } from 'react';
import { Text, Alert, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { ListItem, Rating, Overlay } from 'react-native-elements';
import colors from '../../constants/Colors';
import styles from '../../styles/business/Style_CalendarScreen';

class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
    };
  }

  componentDidMount() {

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
              service: 'Haircut',
              time: '14:30 - 16:00',
              secret: 'This thing took too much time...'
            });
            this.state.items[strTime].push({
              name: 'Shira Star',
              service: 'Yoga',
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
        <ListItem
          title={item.service}
          titleStyle={{fontSize: 16, fontWeight: '500', color: colors.lightBlack, marginBottom: 5}}
          subtitle={item.name}
          subtitleStyle={{fontSize: 14, fontWeight: '400', color: colors.gray02}}
          rightElement={<Text style={{fontSize: 14, fontWeight: '400', color: colors.gray02}}>{item.time}</Text>}
        />
      </TouchableOpacity>
    );
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
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
