import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import styles from '../../styles/customer/Style_ServicesPage';
import database from '../../database';

class ServicesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servicesList: []
    };
    this.renderPricingCard = this.renderPricingCard.bind(this);
    this.fetchServicesList = this.fetchServicesList.bind(this);
  }

  componentDidMount() {
    this.fetchServicesList();
  }

  async fetchServicesList() {
    const url = 'http://192.168.1.198:3000/service/getAllBusinessServices';
    const options = { 
      method: 'POST', 
      headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
      },
      body: JSON.stringify({businessID: this.props.businessData.businessid})
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(async data => {
        // console.log(data)
        this.setState({servicesList: data});
      })
      .catch(error => console.log(error))
  }

  renderPricingCard({ item }) {
    const test_businessData = database.businesses[0];

    return (
      <View style={styles.pricingCardContainer}>
        <View>
          <Text style={styles.titleText}>{item.name}</Text>
        </View>
        <View>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
        <View>
          <Text style={styles.durationText}>{item.durationminutes}</Text>
        </View>
        <View style={styles.bookButtonContainer}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() =>
              this.props.navigation.navigate('Booking', {
                // serviceData: item,
                serviceData: test_businessData.Services[0],
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
    // console.log(this.state.servicesList)
    return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center', marginTop: 35 }}>
            <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={this.state.servicesList}
                renderItem={this.renderPricingCard}
            />
            </View>
        </ScrollView>
    );
  }
}

export default ServicesPage;
