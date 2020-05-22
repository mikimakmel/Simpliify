import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';
import styles from '../../styles/customer/Style_FavoriteBusinessCard';
import { connect } from "react-redux";
import route from '../../routeConfig';

class FavoriteBusinessCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.countUpcomingEvents = this.countUpcomingEvents.bind(this);
    this.incrementBusinessDailyCounter = this.incrementBusinessDailyCounter.bind(this);
  }

  countUpcomingEvents() {
    const { businessData } = this.props;
    let count = 0;

    this.props.ordersList.map(item => {
      if(businessData.businessDetails.business.businessid === item.businessid) {
        if(item.status !== 'Cancelled') {
          count = count + 1;
        }
      }
    });

    return count;
  }

  async incrementBusinessDailyCounter(businessID) {
    const url = `${route}/business/incrementBusinessDailyCounter`;
    const options = { 
      method: 'PUT', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({businessID})
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => console.log(error))
  }

  render() {
    const { businessData } = this.props;
    let eventsCount = this.countUpcomingEvents();

    return (
      <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('Business', { businessData: businessData, isInFavorites: true });
          this.incrementBusinessDailyCounter(businessData.businessDetails.business.businessid);
        }}
      >
        <View>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: businessData.businessDetails.photos.cover.imagelink }} />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{businessData.businessDetails.business.name}</Text>
            {
              eventsCount === 0 ?
              <Text style={styles.noUpcomingText}>{' \u2022 NO UPCOMING EVENTS'}</Text>
              :
              <Text style={styles.upcomingText}>{' \u2022 ' + eventsCount.toString() + ' UPCOMING EVENTS'}</Text>
            }
          </View>
          <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = ({ User, Customer }) => {
  return {
    hasBusiness: User.hasBusiness,
    currentUser: User.currentUser,
    favoritesList: Customer.favoritesList,
    view: User.view,
    ordersList: Customer.ordersList
  }
}

export default connect(mapStateToProps)(FavoriteBusinessCard);
