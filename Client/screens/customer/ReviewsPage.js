import React, { Component } from 'react';
import { View, Text, FlatList, Image, TextInput, ScrollView } from 'react-native';
import { clockRunning } from 'react-native-reanimated';
import { ListItem, Rating, Overlay } from 'react-native-elements';
import colors from '../../constants/Colors';
import GradientButton from 'react-native-gradient-buttons';
import { connect } from "react-redux";
import Review from "react-native-customer-review-bars";
import route from '../../routeConfig';


class ReviewsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewsList: [],
      canWriteReview: false,
      isReviewOverlayVisible: false,
      myRating: 0,
      myDescription: '',
      reviewsCount: [
        { value: 0, type: 'Excellent' },
        { value: 0, type: 'Good' },
        { value: 0, type: 'Average' },
        { value: 0, type: 'Poor' },
        { value: 0, type: 'Hideous' }
      ],
    };
    this.renderReview = this.renderReview.bind(this);
    this.createReviewsList = this.createReviewsList.bind(this);
    this.fetchUser = this.fetchUser.bind(this);
    this.renderReviewOverlay = this.renderReviewOverlay.bind(this);
    this.checkIfRecivedService = this.checkIfRecivedService.bind(this);
  }

  componentDidMount() {
    this.fetchUpdatedReviewsList();
    this.fetchReviewsQuantity();
    this.checkIfRecivedService();
  }

  async createReviewsList(reviews) {
    var newList = await Promise.all(reviews.map(async (item) => {
      let user = await this.fetchUser(item.customer);
      let review = {
        customerAvatar: user.profilepic ? user.profilepic : 'https://www.lococrossfit.com/wp-content/uploads/2019/02/user-icon-300x300.png',
        customerName: `${user.firstname} ${user.lastname}`,
        customerID: item.customer,
        rating: item.rating,
        description: item.description,
        date: item.reviewedat
      }

      return review;
    }));

    this.setState({reviewsList: newList});
  }

  async fetchUser(id) {
    const url = `${route}/user/getUserByID`;
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ userID: id })
    };
    const request = new Request(url, options)

    return await fetch(request)
      .then(response => response.json())
      .then(async data => {
        return await data;
      })
      .catch(error => console.log(error))
  }

  async fetchUpdatedReviewsList() {
    const url = `${route}/review/getBusinessReviews`;
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({businessID: this.props.businessData.businessDetails.business.businessid})
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(async (data) => {
        await this.createReviewsList(data);
      })
      .catch(error => console.log(error))
  }

  async submitNewReview() {
    const url = `${route}/review/createNewReview`;
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        userID: this.props.currentUser.userid,
        businessID: this.props.businessData.businessDetails.business.businessid,
        rating: this.state.myRating,
        description: this.state.myDescription,
      })
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => console.log(error))
  }

  async fetchReviewsQuantity() {
    const url = `${route}/review/getBusinessReviewsByQuantity`;
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({businessID: this.props.businessData.businessDetails.business.businessid})
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        var tempReviewsCount = [
          { value: 0, type: 'Excellent' },
          { value: 0, type: 'Good' },
          { value: 0, type: 'Average' },
          { value: 0, type: 'Poor' },
          { value: 0, type: 'Hideous' }
        ]

        data.map((item) => {
          if(item.rating === 1) {
            tempReviewsCount[4].value = Number(item.count);
          } 
          else if(item.rating === 2) {
            tempReviewsCount[3].value = Number(item.count);
          }
          else if(item.rating === 3) {
            tempReviewsCount[2].value = Number(item.count);
          }
          else if(item.rating === 4) {
            tempReviewsCount[1].value = Number(item.count);
          }
          else if(item.rating === 5) {
            tempReviewsCount[0].value = Number(item.count);
          }
        });

        this.setState({reviewsCount: tempReviewsCount});
      })
      .catch(error => console.log(error))
  }

  renderNameAndDate(item) {
    return(
      <View style={{flexDirection: 'row', alignContent: 'center', alignItems: 'center', marginBottom: 5}}>
        <Text style={{fontSize: 14, fontWeight: '500', color: colors.lightBlack}}>
          {item.customerName}
        </Text>
        <Text style={{fontSize: 14, fontWeight: '300', color: colors.gray02}}>
          {' \u2022 '}
        </Text>
        <Text style={{fontSize: 12, fontWeight: '400', color: colors.gray03, marginTop: 1}}>
          {this.getPrettyDate(item.date)}
        </Text>
      </View>
    )
  }

  renderRatingAndDescription(item) {
    return(
      <View style={{alignItems: 'flex-start'}}>
        <Rating
          style={{marginBottom: 5}}
          imageSize={16}
          readonly={true}
          startingValue={item.rating}
          ratingColor={'#FED56B'}
          type={'custom'}
        />
        <Text style={{fontSize: 12, fontWeight: '400', color: colors.gray04}}>{item.description}</Text>
      </View>
    );
  }

  renderReview({item}) {
    return(
      <ListItem
        leftAvatar={{ source: { uri: item.customerAvatar }, size: 45, marginBottom: 20}}
        title={this.renderNameAndDate(item)}
        subtitle={this.renderRatingAndDescription(item)}
        bottomDivider={true}
      />
    );
  }

  getPrettyDate(reviewedAt) {
    const day = reviewedAt.split('-')[2].substring(0,2);
    const month = months[new Date(reviewedAt).getMonth()];
    const year = reviewedAt.split('-')[0];

    return `${day} ${month} ${year}`;
  }

  async checkIfRecivedService() {
    const url = `${route}/order/checkIfCustomerReceiveServiceFromBusiness`;
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        customerID: this.props.currentUser.userid,
        businessID: this.props.businessData.businessDetails.business.businessid,
      })
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then((data) => {
        this.setState({canWriteReview: data.didReceive})
      })
      .catch(error => console.log(error))
  }

  renderNoReviews() {
    return(
      <View style={{flex: 1, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center'}}>
        <Text>No reviews yet</Text>
        <Image source={require('../../assets/images/reviews.png')} style={{width: 100, height: 100}}/>
      </View>
    );
  }

  renderReviewsList() {
    return(
      <View>
        <FlatList
          data={this.state.reviewsList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderReview}
        />
      </View>
    );
  }

  renderWriteReview() {
    if(this.state.canWriteReview) {
      return(
        <ListItem
          contentContainerStyle={{alignItems: 'center', justifyContent: 'center', marginTop: 5}}
          title={'Write a review'}
          titleStyle={{color: colors.blue}}
          onPress={() => this.setState({isReviewOverlayVisible: true})}
        />
      );
    }
  }

  renderReviewOverlay() {
    return(
      <Overlay 
        isVisible={this.state.isReviewOverlayVisible} 
        onBackdropPress={() => this.setState({isReviewOverlayVisible: false})}
        overlayStyle={{height: '50%', width: '90%'}}
      >
        <View style={{flex: 1, alignItems: 'center',}}>
          <Text style={{fontSize: 16, color: colors.gray04, marginTop: 10, marginBottom: 20}}>How was your experience?</Text>
          <Rating
            style={{marginBottom: 5}}
            imageSize={35}
            startingValue={this.state.myRating}
            ratingColor={'#FED56B'}
            type={'custom'}
            onFinishRating={(rating) => this.setState({myRating: rating})}
          />
          <TextInput
            style={{ height: '35%', width: '80%', marginTop: 30, borderColor: colors.gray02, borderWidth: 1, borderRadius: 12}}
            multiline={true}
            placeholder={'Write your review...'}
            onChangeText={text => this.setState({myDescription: text})}
          />
          <View style={{position: 'absolute', bottom: 30, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
            <GradientButton
              gradientBegin="#FC642D"
              gradientEnd="#FF5A5F"
              gradientDirection="diagonal" 
              style={{ marginVertical: 8, opacity: 0.9 }}
              textStyle={{ fontSize: 18, fontWeight: '400' }}
              height={45}
              width={'80%'}
              radius={10}
              impact={true}
              impactStyle={'Medium'}
              onPressAction={async () => {
                this.setState({isReviewOverlayVisible: false});
                await this.submitNewReview();
                alert('Your review sent successfully');
                await this.fetchUpdatedReviewsList();
                await this.fetchReviewsQuantity();
              }}
            >
              Submit
            </GradientButton>
          </View>
        </View>
      </Overlay>
    );
  }

  render() {
    if(!this.state.reviewsList.length === 0) {
      return this.renderNoReviews();
    }
    else {
      return(
        <ScrollView style={{backgroundColor: colors.white}}>
          {this.renderWriteReview()}
          {this.renderReviewOverlay()}
          <View style={{width: '90%', alignSelf: 'center', marginBottom: 20, marginTop: this.state.canWriteReview ? 0 : 20}}>
            <Review reviews={this.state.reviewsCount} showCount={true} barStyle={{backgroundColor: colors.gray01, opacity: 0.8}}/>
          </View>
          {this.renderReviewsList()}
        </ScrollView>
      );
    }
  }
}

const mapStateToProps = ({ App, User, Customer, Business }) => {
  return {
    hasBusiness: User.hasBusiness,
    currentUser: User.currentUser,
    favoritesList: Customer.favoritesList,
    view: User.view,
    categoriesList: App.categoriesList,
    currentBusiness: Business.currentBusiness
  }
}

export default connect(mapStateToProps)(ReviewsPage);

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]