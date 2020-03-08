import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import colors from '../../../constants/Colors';
import styles from '../../../styles/customer/Style_ExploreScreen';
import database from '../../../database';
import { Rating } from 'react-native-elements';

class RecomendedCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.recommendedCardContainer}>
            <View style={{ flex: 1 }}>
                <Image source={{ uri: this.props.businessData.Pictures.Favorite }} 
                style={{flex: 1, width: null, height: null, resizeMode: 'cover'}} 
                />
            </View>
            <View style={{ alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 10, color: colors.red, fontWeight: '400', marginTop: 5 }}>Category</Text>
                <Text style={{ fontSize: 12, color: colors.gray04, fontWeight: '700', marginTop: 3}}>{this.props.businessData.Name}</Text>
                <Text style={{ fontSize: 10, color: colors.gray04, fontWeight: '400', marginTop: 3}}>Price Range: 50$ - 470$</Text>
                <View style={{ 
                    flexDirection: 'row',
                    marginTop: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                 }}>
                    <Rating 
                        imageSize={11} 
                        readonly 
                        startingValue={this.props.businessData.Ranking} 
                        ratingColor={colors.green01} 
                        type={'custom'}
                    />
                    <Text style={{ fontSize: 8, color: colors.green01, fontWeight: '500', marginLeft: 3 }}>{this.props.businessData.Ranking}</Text>
                </View>
            </View>
      </View>
    );
  }
}

export default RecomendedCard;
