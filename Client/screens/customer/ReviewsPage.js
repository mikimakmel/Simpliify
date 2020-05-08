import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { clockRunning } from 'react-native-reanimated';

class ReviewsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.renderReview = this.renderReview.bind(this);
  }

  renderReview() {
    return(
        <View>
            <View>

            </View>
        </View>
    )
  }

  render() {
    const businessData = this.props.businessData.businessDetails;
    console.log(businessData.reviews)
    return (
      <View>
        {this.renderReview()}
      </View>
    );
  }
}

export default ReviewsPage;
