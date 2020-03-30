import React, { Component } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import AboutPage from '../customer/AboutPage';
import ServicesPage from '../customer/ServicesPage';
import styles from '../../styles/customer/Style_BusinessScreen';
import colors from '../../constants/Colors';
import ImagesSwiper from 'react-native-image-swiper';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Layout from '../../constants/Layout';

export default class BusinessScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessData: this.props.route.params.businessData,
    }
    this.renderBusinessInfo = this.renderBusinessInfo.bind(this);
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
          isInUserFavorites={this.state.isInUserFavorites}
          businessData={businessData}
        />
        <ServicesPage
          tabLabel="Services"
          businessData={businessData}
          navigation={this.props.navigation}
        />
      </ScrollableTabView>
    )
  }

  render() {
    const { businessData } = this.state;

    return (
      <View style={styles.flexContainer}>
        <View style={styles.ImagesSwiperContainer}>
          <ImagesSwiper
            images={businessData.Pictures.Carousel}
            autoplay={true}
            autoplayTimeout={5}
            showsPagination
            width={Layout.window.width}
            height={200}
          />
        </View>
        {this.renderBusinessInfo()}
      </View>
    )
  }
}
