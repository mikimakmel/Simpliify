import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import colors from '../../../constants/Colors';
import styles from '../../../styles/customer/Style_ExploreScreen';
import database from '../../../database';
import { Rating } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from "react-redux";
import route from '../../../routeConfig';

class ResultCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessPressed: {}
    };
    this.fetchBusiness = this.fetchBusiness.bind(this);
  }

  async fetchBusiness(businessID) {
    const url = `${route}/business/getBusinessByID`;
    const options = { 
      method: 'POST', 
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
        // console.log(data)
        // return data;
        this.setState({businessPressed: data})
      })
      .catch(error => console.log(error))
  }

  calculatePriceRange(servicesList) {
    let minPrice = Number.MAX_SAFE_INTEGER;
    let maxPrice = Number.MIN_SAFE_INTEGER;

    servicesList.map((item) => {
      if(item.price > maxPrice) {
        maxPrice = item.price;
      }
      if(item.price < minPrice) {
        minPrice = item.price;
      }
    });

    return `Price Range: ₪${minPrice} - ₪${maxPrice}`;
  }

  isInFavorites() {
    const businessData = this.props.businessData;
    let bool = false;

    this.props.favoritesList.map((item) => {
      if(item.businessDetails.business.businessid === businessData.businessID) {
        bool = true;
      }
    });

    return bool;
  }

  renderFavoriteIcon() {
    return(
      <View style={{zIndex: 1}}>
        <Ionicons name="md-heart" size={20} color={colors.white} style={{position: 'absolute', zIndex: 1, right: 8, top: 5}}/>
        <Ionicons name="md-heart" size={16} color={colors.red} style={{position: 'absolute', zIndex: 2, right: 9.6, top: 6.9, opacity: 0.9}}/>
      </View>
    )
  }

  render() {
    const businessData = this.props.businessData;

    return (
      <TouchableOpacity 
        style={styles.recommendedCardContainer}
        onPress={async () => {
          await this.fetchBusiness(businessData.businessID);
          this.props.navigation.navigate('Business', {
            businessData: this.state.businessPressed, 
            isInFavorites: this.isInFavorites()
          })
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {this.isInFavorites() === true ? this.renderFavoriteIcon() : null}
            <Image 
              source={{ uri: businessData.coverPic }} 
              style={{flex: 1, width: null, height: null, resizeMode: 'stretch', borderWidth: 0.25, borderColor: colors.gray04, borderRadius: 2}} 
            />
          </View>
        </View>
        <View style={{ alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 10, color: colors.red, fontWeight: '500', marginTop: 5 }}>
            {businessData.category}
          </Text>
          <Text style={{ fontSize: 12, color: colors.gray04, fontWeight: '700', marginTop: 3}}>
            {businessData.businessName}
          </Text>
          <Text style={{ fontSize: 10, color: colors.gray04, fontWeight: '400', marginTop: 3}}>
            {/* {this.calculatePriceRange(businessData.services)} */}
            {`Price Range: ₪${businessData.minPrice} - ₪${businessData.maxPrice}`}
          </Text>
          <View style={{ 
              flexDirection: 'row',
              marginTop: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Rating 
                imageSize={11} 
                readonly 
                startingValue={Number(businessData.rating)} 
                ratingColor={colors.green03} 
                type={'custom'}
              />
              <Text style={{ fontSize: 10, color: colors.green03, fontWeight: '700', marginLeft: 4, marginTop: 1 }}>
                {businessData.rating}
              </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

function ResultCardNavigation(props) {
  const navigation = useNavigation();
  return (<ResultCard {...props} navigation={navigation}/>);
}

const mapStateToProps = ({ App, User, Customer, Business }) => {
  return {
    hasBusiness: User.hasBusiness,
    currentUser: User.currentUser,
    favoritesList: Customer.favoritesList,
    view: User.view,
    categoriesList: App.categoriesList,
  }
}

export default connect(mapStateToProps)(ResultCardNavigation);