import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import colors from '../../../constants/Colors';
import styles from '../../../styles/customer/Style_ExploreScreen';
import database from '../../../database';
import { Rating } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from "react-redux";

class ResultCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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

    return `Price Range: ${minPrice}₪ - ${maxPrice}₪`;
  }

  isInFavorites() {
    const businessData = this.props.businessData.businessDetails;
    let bool = false;

    this.props.favoritesList.map((item) => {
      if(item.businessDetails.business.businessid === businessData.business.businessid) {
        bool = true;
      }
    });

    return bool;
  }

  renderFavoriteIcon() {
    return(
      <View style={{zIndex: 1}}>
        <Ionicons name="md-heart" size={20} color={colors.white} style={{position: 'absolute', zIndex: 1, right: 8, top: 5}}/>
        <Ionicons name="md-heart" size={16} color={colors.red} style={{position: 'absolute', zIndex: 2, right: 9.6, top: 6.9}}/>
      </View>
    )
  }

  render() {
    const businessData = this.props.businessData.businessDetails;

    return (
      <TouchableOpacity 
        style={styles.recommendedCardContainer}
        onPress={() => this.props.navigation.navigate('Business', {businessData: this.props.businessData, isInFavorites: this.isInFavorites()})}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {this.isInFavorites() === true ? this.renderFavoriteIcon() : null}
            <Image 
              source={{ uri: businessData.photos.cover.imagelink }} 
              style={{flex: 1, width: null, height: null, resizeMode: 'stretch', borderWidth: 0.25, borderColor: colors.gray04, borderRadius: 2}} 
            />
          </View>
        </View>
        <View style={{ alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 10, color: colors.red, fontWeight: '400', marginTop: 5 }}>
            {businessData.business.category}
          </Text>
          <Text style={{ fontSize: 12, color: colors.gray04, fontWeight: '700', marginTop: 3}}>
            {businessData.business.name}
          </Text>
          <Text style={{ fontSize: 10, color: colors.gray04, fontWeight: '400', marginTop: 3}}>
            {this.calculatePriceRange(businessData.services)}
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
                startingValue={Number(businessData.business.rating)} 
                ratingColor={colors.green03} 
                type={'custom'}
              />
              <Text style={{ fontSize: 8, color: colors.green03, fontWeight: '500', marginLeft: 3 }}>
                {businessData.business.rating}
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