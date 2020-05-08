import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AboutPage from '../customer/AboutPage';
import ServicesPage from '../customer/ServicesPage';
import ReviewsPage from '../customer/ReviewsPage';
import styles from '../../styles/customer/Style_BusinessScreen';
import colors from '../../constants/Colors';
import ImagesSwiper from 'react-native-image-swiper';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Layout from '../../constants/Layout';
import database from '../../database';
import { Button, Overlay } from 'react-native-elements';
import { connect } from "react-redux";
import * as Actions_Customer from '../../redux/actions/Actions_Customer';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

class BusinessScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessData: this.props.route.params.businessData,
      carousel: []
    }
    this.renderBusinessInfo = this.renderBusinessInfo.bind(this);
    this.renderAddToFavoritesButton = this.renderAddToFavoritesButton.bind(this);
  }

  renderBusinessInfo() {
    const { businessData } = this.state;

    return (
      <ScrollableTabView
        initialPage={0}
        locked={true}
        tabBarUnderlineStyle={styles.tabBarUnderline}
        tabBarBackgroundColor={'#FEFDFF'}
        tabBarActiveTextColor={colors.red}
        tabBarInactiveTextColor={'grey'}
        tabBarTextStyle={styles.tabBarText}
      >
        <AboutPage
          tabLabel="About"
          businessData={businessData}
        />
        <ServicesPage
          tabLabel="Services"
          businessData={businessData}
          navigation={this.props.navigation}
        />
        <ReviewsPage
          tabLabel="Reviews"
          businessData={businessData}
        />
      </ScrollableTabView>
    )
  }

  renderAddToFavoritesButton() {
    return (
      <View style={styles.askToJoinContainer}>
        <View style={styles.askToJoinInsideContainer}>
          <Text style={styles.joinText}>Add to your favorites</Text>
          <Button
            title="Add"
            type="outline"
            containerStyle={styles.joinButtonContainer}
            buttonStyle={styles.joinButton}
            titleStyle={styles.joinButtonTitle}
            onPress={() => {
              // this.setState({ overlayVisible: true })
              // this.addBusinessToFavorites()
              this.props.dispatch(Actions_Customer.addToFavoritesList(this.state.businessData));
            }}
          />
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.flexContainer}>
        <View style={styles.ImagesSwiperContainer}>
          <ImagesSwiper
            images={
              this.state.businessData.businessDetails.photos.carousel.map((item) => {
                return item.imagelink;
            })}
            autoplay={true}
            autoplayTimeout={5}
            showsPagination
            width={Layout.window.width}
            height={200}
          />
        </View>
        {this.renderBusinessInfo()}
        {this.props.route.params.isInFavorites ? this.renderAddToFavoritesButton() : null}
      </View>
    )
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

export default connect(mapStateToProps)(BusinessScreen);