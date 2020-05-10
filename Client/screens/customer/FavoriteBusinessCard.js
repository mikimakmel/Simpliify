import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';
import styles from '../../styles/customer/Style_FavoriteBusinessCard';
import { connect } from "react-redux";

class FavoriteBusinessCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eventsCount: 0
    }
    this.countUpcomingEvents = this.countUpcomingEvents.bind(this);
  }

  componentDidMount() {
    this.countUpcomingEvents();
  }

  countUpcomingEvents() {
    const { businessData } = this.props;
    let count = 0;

    this.props.ordersList.map(item => {
      if(businessData.businessDetails.business.businessid === item.businessid) {
        count = count + 1;
      }
    });

    this.setState({ eventsCount: count });
  }

  render() {
    const { businessData } = this.props;

    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Business', { businessData: businessData, isInFavorites: true })}>
        <View>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: businessData.businessDetails.photos.cover.imagelink }} />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{businessData.businessDetails.business.name}</Text>
            {
              this.state.eventsCount === 0 ?
              <Text style={styles.noUpcomingText}>{' \u2022 NO UPCOMING EVENTS'}</Text>
              :
              <Text style={styles.upcomingText}>{' \u2022 ' + this.state.eventsCount + ' UPCOMING EVENTS'}</Text>
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
