import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Alert, TouchableOpacity } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { ListItem, Button, Overlay } from 'react-native-elements';
import colors from '../../constants/Colors';
import styles from '../../styles/customer/Style_BookingScreen';
// import * as Calendar from 'expo-calendar'
// import * as Permissions from 'expo-permissions'
// import moment from 'moment'

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
  }

  renderRow({ item }) {
    return (
      <View>
        <ListItem
          title={item.Time}
          titleStyle={styles.ListTitle}
          subtitle={item.Hosting}
          subtitleStyle={styles.ListSubtitle}
          bottomDivider
          checkmark={
            <Button
              buttonStyle={styles.ButtonStyling}
              titleStyle={styles.ButtonTitleStyling}
              containerViewStyle={{ witdh: 70 }}
              type="outline"
              large
              title="Book"
            //   onPress={() => this.handleBookButtonPressed(item)}
            />
          }
        />
      </View>
    )
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
                keyExtractor={this.keyExtractor}
            />
            </ScrollView>
            {/* {this.renderOverlay()} */}
        </View>
    );
  }
}

export default BookingScreen;
