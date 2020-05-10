import React, { Component } from 'react';
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import AboutPage from '../customer/AboutPage';
import ServicesPage from '../customer/ServicesPage';
import ReviewsPage from '../customer/ReviewsPage';
import styles from '../../styles/customer/Style_BusinessScreen';
import colors from '../../constants/Colors';
import ImagesSwiper from 'react-native-image-swiper';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Layout from '../../constants/Layout';
import { Button } from 'react-native-elements';
import { connect } from "react-redux";
import * as Actions_Customer from '../../redux/actions/Actions_Customer';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome, FontAwesome5, Ionicons, Octicons, Entypo } from '@expo/vector-icons';

class BusinessScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessData: this.props.route.params.businessData,
      carousel: [],
      hideAddToFavoritesButton: false,
      menu: null
    }
    this.renderBusinessInfo = this.renderBusinessInfo.bind(this);
    this.renderAddToFavoritesButton = this.renderAddToFavoritesButton.bind(this);
    this.fetchAddToFavorites = this.fetchAddToFavorites.bind(this);
    this.fetchRemoveFromFavorites = this.fetchRemoveFromFavorites.bind(this);
    this.handleRemoveFromFavorites = this.handleRemoveFromFavorites.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: 'Business',
      headerRight: () => (
        <Entypo 
          name={'dots-three-vertical'} 
          size={26} 
          color={colors.lightBlack} 
          onPress={this.showMenu} 
          style={{}}
        />
      ),
      headerLeft: () => (
        <MaterialIcons 
          name={'keyboard-arrow-left'} 
          size={45} 
          color={colors.lightBlack}
          onPress={() => this.props.navigation.goBack()}
        />
      ),
    });
  }

  setMenuRef = ref => {
    this.menu = ref;
  };
 
  hideMenu = () => {
    this.menu.hide();
  };
 
  showMenu = () => {
    this.menu.show();
  };

  handleRemoveFromFavorites() {
    // console.log(this.state.businessData.businessDetails.business.businessid)
    this.hideMenu();
    this.props.dispatch(Actions_Customer.removeFromFavoritesList(this.state.businessData.businessDetails.business.businessid));
    this.fetchRemoveFromFavorites();
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
            type="outline"
            containerStyle={styles.joinButtonContainer}
            buttonStyle={styles.joinButton}
            titleStyle={styles.joinButtonTitle}
            icon={<MaterialIcons name={'favorite-border'} size={25} color={colors.white}/>}
            onPress={() => {
              alert(`${this.state.businessData.businessDetails.business.name} added to favorites!`);
              this.setState({ hideAddToFavoritesButton: true });
              this.props.dispatch(Actions_Customer.addToFavoritesList(this.state.businessData));
              this.fetchAddToFavorites();
            }}
          />
        </View>
      </View>
    )
  }

  async fetchAddToFavorites() {
    const url = 'http://192.168.1.198:3000/customer/addBusinessToFavorites';
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        userID: this.props.currentUser.userid,
        businessID: this.state.businessData.businessDetails.business.businessid
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

  async fetchRemoveFromFavorites() {
    const url = 'http://192.168.1.198:3000/customer/removeBusinessFromFavorites';
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        userID: this.props.currentUser.userid,
        businessID: this.state.businessData.businessDetails.business.businessid
      })
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => console.log(error))
  }

  render() {
    return (
      <View style={styles.flexContainer}>
        <StatusBar barStyle="dark-content"/>
        <View style={{width: 200, position: 'absolute', right: 0}}>
          <Menu ref={this.setMenuRef} style={{flex: 1}}>
            <MenuItem onPress={this.handleRemoveFromFavorites} textStyle={{color: 'red'}}>Remove from favorites</MenuItem>
          </Menu>
        </View>
        <View style={styles.ImagesSwiperContainer}>
          <ImagesSwiper
            autoplay={true}
            autoplayTimeout={5}
            showsPagination
            width={Layout.window.width}
            height={200}
            images={this.state.businessData.businessDetails.photos.carousel.map((item) => item.imagelink)}
          />
        </View>
        {this.renderBusinessInfo()}
        {this.props.route.params.isInFavorites || this.state.hideAddToFavoritesButton ? null : this.renderAddToFavoritesButton()}
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