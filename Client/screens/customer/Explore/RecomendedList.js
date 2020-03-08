import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import colors from '../../../constants/Colors';
import RecomendedCard from '../Explore/RecomendedCard';
import styles from '../../../styles/customer/Style_ExploreScreen';
import database from '../../../database';

class RecomendedList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.renderItem = this.renderItem.bind(this);
  }

    renderItem({ item, index }) {
        return(
            <RecomendedCard businessData={item} index={index}/>
        )
    }

  render() {
    return (
      <View style={{ marginTop: 30 }}>
          <Text style={styles.recomendedHeadline}>Recommended Services</Text>
          <View style={{ marginTop: 20, paddingHorizontal: 24, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {/* <FlatList
                data={database.businesses}
                keyExtractor={item => item.ID.toString()}
                renderItem={this.renderItem}
            /> */}
            <RecomendedCard businessData={database.businesses[0]} index={0}/>
            <RecomendedCard businessData={database.businesses[0]} index={0}/>
            <RecomendedCard businessData={database.businesses[0]} index={0}/>
            <RecomendedCard businessData={database.businesses[0]} index={0}/>
          </View>
      </View>
    );
  }
}

export default RecomendedList;
