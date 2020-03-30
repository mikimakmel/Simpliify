import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import styles from '../../styles/customer/Style_ServicesPage';

class ServicesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.renderPricingCard = this.renderPricingCard.bind(this);
  }

  renderPricingCard({ item }) {
    return (
      <View style={styles.pricingCardContainer}>
        <View>
          <Text style={styles.titleText}>{item.Name}</Text>
        </View>
        <View>
          <Text style={styles.priceText}>{item.Price}</Text>
        </View>
        <View>
          <Text style={styles.durationText}>{item.Duration}</Text>
        </View>
        <View style={styles.bookButtonContainer}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() =>
              this.props.navigation.navigate('Booking', {
                serviceData: item,
                businessData: this.props.businessData
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
    return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center', marginTop: 35 }}>
            <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={this.props.businessData.Services}
                renderItem={this.renderPricingCard}
            />
            </View>
        </ScrollView>
    );
  }
}

export default ServicesPage;
