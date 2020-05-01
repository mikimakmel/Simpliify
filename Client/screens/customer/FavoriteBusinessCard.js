import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { Divider } from 'react-native-elements';
import styles from '../../styles/customer/Style_FavoriteBusinessCard';
import database from '../../database';

export default class FavoriteBusinessCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // isInUserFavorites: false,
      eventsCount: 3
    }
    // this.checkIfIsInFavorites = this.checkIfIsInFavorites.bind(this)
    // this.countUpcomingEvents = this.countUpcomingEvents.bind(this)
  }

  // componentWillReceiveProps() {
  //   this.countUpcomingEvents()
  // }

  // componentDidMount() {
  //   this.checkIfIsInFavorites()
  // }

  // checkIfIsInFavorites() {
  //   AsyncStorage.getItem('Businesses').then(favs => {
  //     let arr = []
  //     if (JSON.parse(favs) !== null) {
  //       arr = JSON.parse(favs)
  //       arr.map(item => {
  //         if (item.ID === this.props.businessData.ID) {
  //           this.setState({ isInUserFavorites: true })
  //         }
  //       })
  //     }
  //   })
  // }

  // async countUpcomingEvents() {
  //   let count = 0
  //   await AsyncStorage.getItem('Schedule', (err, result) => {
  //     if (result !== null) {
  //       const arr = JSON.parse(result)
  //       count = 0
  //       arr.map(item => {
  //         if (item.BusinessID === this.props.businessData.ID) {
  //           count++
  //         }
  //       })
  //     }
  //   })

  //   this.setState({ eventsCount: count })
  // }

  render() {
    const { businessData } = this.props

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('Business', {
            businessData,
            // isInUserFavorites: this.state.isInUserFavorites,
            // prevScreen: 'Home'
          })
        }
      >
        <View>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: businessData.businessDetails.photos.cover.imagelink }} />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{businessData.businessDetails.business.name}</Text>
            {this.state.eventsCount === 0 ? (
              <Text style={styles.noUpcomingText}>{' \u2022 NO UPCOMING EVENTS'}</Text>
            ) : (
              <Text style={styles.upcomingText}>
                {' \u2022 ' + this.state.eventsCount + ' UPCOMING EVENTS'}
              </Text>
            )}
          </View>
          <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
