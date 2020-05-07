import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import colors from '../../../constants/Colors';
import ResultCard from './ResultCard';
import styles from '../../../styles/customer/Style_ExploreScreen';
import database from '../../../database';

class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderItem({item}) {
    return(
      <ResultCard businessData={item}/>
    )
  }

  render() {
    return (
      <View style={{ marginTop: 15 }}>
        <Text style={styles.recomendedHeadline}>
          {this.props.resultList.length > 0 ? `Explore results` : 'No results'}
        </Text>
        <View style={{marginTop: 20,}}>
          <FlatList
            data={this.props.resultList}
            keyExtractor={item => item.businessID.toString()}
            renderItem={this.renderItem}
            numColumns={2}
            columnWrapperStyle={{paddingHorizontal: 12, justifyContent: "space-around"}}
          />
        </View>
      </View>
    );
  }
}

export default ResultsList;
