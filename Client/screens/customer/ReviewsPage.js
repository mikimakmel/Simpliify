import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { clockRunning } from 'react-native-reanimated';
import { ListItem, Rating } from 'react-native-elements';

const list = [
    {
      name: 'Amy Farha',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      subtitle: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
    },
    {
      name: 'Chris Jackson',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      subtitle: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
    },
]

class ReviewsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.renderReview = this.renderReview.bind(this);
  }

  renderReview({item}) {
    return(
        <ListItem
            // key={index}
            // chevron={this.renderHour}
            leftAvatar={{ source: { uri: item.avatar_url }, size: 40 }}
            title={item.name}
            titleStyle={{ fontWeight: '600', fontSize: 14 }}
            subtitle={item.subtitle}
            subtitleStyle={{ fontWeight: '400', fontSize: 12 }}
            // topDivider={item.new === true ? false : true }
            // containerStyle={{ backgroundColor: item.new === true ? 'rgba(237, 136, 136, 0.35)' : 'white' }}
            bottomDivider={true}
            rightIcon={
                <Rating
                    // style={styles.rating}
                    imageSize={18}
                    readonly={true}
                    startingValue={4}
                    ratingColor={'#FED56B'}
                    type={'custom'}
                />
            }
        />
    )
  }

  render() {
    const businessData = this.props.businessData.businessDetails;
    // console.log(businessData.reviews)
    return (
      <View>
        <FlatList
            data={list}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderReview}
        />
      </View>
    );
  }
}

export default ReviewsPage;
