import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import styles from '../../styles/customer/Style_ServicesPage';
import database from '../../database';

class ServicesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.renderPricingCard = this.renderPricingCard.bind(this);
  }

  renderPricingCard({ item }) {
    function convertMinsToHrsMins(mins) {
      let h = Math.floor(mins / 60);
      let m = mins % 60;
      let text = h > 0 ? 'hrs' : 'mins'
      m = m < 10 ? '0' + m : m;
      if(h === 0) {
        return `${m} ${text}`;
      }
      else {
        return `${h}:${m} ${text}`;
      }
    }

    return (
      <View style={styles.pricingCardContainer}>
        <View>
          <Text style={styles.titleText}>{item.name}</Text>
        </View>
        <View>
          <Text style={styles.priceText}>₪{item.price}</Text>
        </View>
        <View>
          <Text style={styles.durationText}>
            {convertMinsToHrsMins(item.durationminutes)}
          </Text>
        </View>
        <View style={styles.bookButtonContainer}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() =>
              this.props.navigation.navigate('Booking', {
                serviceData: item,
                businessData: this.props.businessData.businessDetails
              })
            }
          >
            <Text style={styles.bookButtonTitle}>Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const businessData = this.props.businessData.businessDetails;

    return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center', marginTop: 35 }}>
            <FlatList
                keyExtractor={(item) => item.serviceid.toString()}
                data={businessData.services}
                renderItem={this.renderPricingCard}
            />
            </View>
        </ScrollView>
    );
  }
}

export default ServicesPage;
