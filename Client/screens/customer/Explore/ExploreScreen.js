import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView, Animated, TouchableOpacity, TextInput } from 'react-native';
import colors from '../../../constants/Colors';
import styles from '../../../styles/customer/Style_ExploreScreen';
import CategoriesList from './CategoriesList';
import SearchBar from './SearchBar';
import ResultsList from './ResultsList';
import { connect } from "react-redux";
import * as Location from 'expo-location';
import { Overlay, Slider, Button, Rating } from 'react-native-elements';

class ExploreScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      searchResults: [],
      isLoading: false,
      currentLocation: {},
      distance: null,
      isDistanceOverylayVisible: false,
      minPrice: '0',
      maxPrice: null,
      isPriceOverylayVisible: false,
      rating: 0,
      isRatingOverylayVisible: false,
      category: 'All',
    };
    this.getPermissionAsync = this.getPermissionAsync.bind(this);
    this.renderDistancePickerOverlay = this.renderDistancePickerOverlay.bind(this);
    this.renderRatingPickerOverlay = this.renderRatingPickerOverlay.bind(this);
    this.renderPricePickerOverlay = this.renderPricePickerOverlay.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.fetchSearch = this.fetchSearch.bind(this);
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  async getPermissionAsync() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need location permissions to make this work!');
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ currentLocation: location });
  }

  componentWillMount() {
    this.scrollY = new Animated.Value(0);
    this.startHeaderHeight = 120;
    this.endHeaderHeight = 80;
    this.animatedHeaderHeight = this.scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [this.startHeaderHeight, this.endHeaderHeight],
      extrapolate: 'clamp'
    })
    this.animatedOpacity = this.animatedHeaderHeight.interpolate({
      inputRange: [this.endHeaderHeight, this.startHeaderHeight],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })
    this.animatedTagTop = this.animatedHeaderHeight.interpolate({
      inputRange: [this.endHeaderHeight, this.startHeaderHeight],
      outputRange: [-30, 10],
      extrapolate: 'clamp'
    })
    this.startHeaderHeight = this.scrollY.interpolate({
      inputRange: [0, 40],
      outputRange: [this.startHeaderHeight, this.endHeaderHeight],
      extrapolate: 'clamp'
    })
    this.searchBarHeight = this.scrollY.interpolate({
      inputRange: [0, 10],
      outputRange: [0, 10],
      extrapolate: 'clamp'
    })
  }

  handleCategoryChange(chosen) {
    this.setState({ category: chosen});
  }

  updateSearch(text) {
    this.setState({ searchQuery: text});
  }

  async fetchSearch() {
    const url = 'http://192.168.1.198:3000/search/search';
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        searchQuery: this.state.searchQuery,
        radius: this.state.distance,
        lon: this.state.currentLocation.coords.longitude,
        lat: this.state.currentLocation.coords.latitude,
        category: this.state.category,
        rating: this.state.rating,
        minPrice: this.state.minPrice,
        maxPrice: this.state.maxPrice,
      })
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        this.setState({searchResults: data});
      })
      .catch(error => console.log(error))
  }

  renderDistancePickerOverlay() {
    return(
      <Overlay 
        isVisible={this.state.isDistanceOverylayVisible} 
        onBackdropPress={() => this.setState({ isDistanceOverylayVisible: false })}
        overlayStyle={{height: 200}}
      >
        <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <Text>Search by distance:</Text>
          <Text style={{fontSize: 18, fontWeight: '600', marginTop: 10}}>{this.state.distance}km</Text>
          <Slider
            value={this.state.distance}
            onValueChange={value => this.setState({ distance: value })}
            maximumValue={100}
            minimumTrackTintColor={colors.green03}
            minimumValue={1}
            step={1}
            value={this.state.distance}
            style={{width: '80%'}}
            thumbTintColor={colors.green03}
          />
          <Button
            buttonStyle={{   
              borderRadius: 10,
              borderColor: colors.green03,
              borderWidth: 1.5,
            }}
            titleStyle={{
              color: colors.green03,
              fontWeight: '400',
              fontSize: 14
            }}
            containerStyle={{ width: '40%', height: 40, marginTop: 20 }}
            type="outline"
            title="Apply"
            onPress={() => {
              this.setState({ isDistanceOverylayVisible: false });
              this.fetchSearch();
            }}
          />
        </View>
      </Overlay>
    );
  }

  renderRatingPickerOverlay() {
    return(
      <Overlay 
        isVisible={this.state.isRatingOverylayVisible} 
        onBackdropPress={() => this.setState({ isRatingOverylayVisible: false })}
        overlayStyle={{height: 200}}
      >
        <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <Rating
            ratingCount={4}
            imageSize={35}
            startingValue={1}
            onFinishRating={(value) => this.setState({ rating: value })}
            type={'custom'}
          />
          <Text style={{fontSize: 18, fontWeight: '600', marginTop: 10}}>& Up</Text>
          
          <Button
            buttonStyle={{   
              borderRadius: 10,
              borderColor: colors.green03,
              borderWidth: 1.5,
            }}
            titleStyle={{
              color: colors.green03,
              fontWeight: '400',
              fontSize: 14
            }}
            containerStyle={{ width: '40%', height: 40, marginTop: 30 }}
            type="outline"
            title="Apply"
            onPress={() => {
              this.setState({ isRatingOverylayVisible: false });
              this.fetchSearch();
            }}
          />
        </View>
      </Overlay>
    );
  }

  renderPricePickerOverlay() {
    return(
      <Overlay 
        isVisible={this.state.isPriceOverylayVisible} 
        onBackdropPress={() => this.setState({ isPriceOverylayVisible: false })}
        overlayStyle={{height: 200}}
      >
        <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 14, fontWeight: '600'}}>Price range:</Text>
          <View style={{flexDirection: 'row', marginTop: 15, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 14, fontWeight: '400', marginRight: 10, marginLeft: 10}}>min</Text>
            <TextInput 
              style={{borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20, fontSize: 16, fontWeight: '500',}}
              returnKeyType={'done'}
              selectTextOnFocus={true}
              defaultValue={'0'}
              placeholderTextColor={colors.gray04}
              onChangeText={(value) => this.setState({ minPrice: value })}
              keyboardType="numeric"
            />
            <Text style={{fontSize: 18, fontWeight: '500', marginRight: 10, marginLeft: 10}}>-</Text>
            <TextInput 
              style={{borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20, fontSize: 16, fontWeight: '500',}}
              returnKeyType={'done'}
              selectTextOnFocus={true}
              defaultValue={'0'}
              placeholderTextColor={colors.gray04}
              onChangeText={(value) => this.setState({ maxPrice: value })}
              keyboardType="numeric"
            />
            <Text style={{fontSize: 14, fontWeight: '400', marginRight: 10, marginLeft: 10}}>max</Text>
          </View>

          <Button
            buttonStyle={{   
              borderRadius: 10,
              borderColor: colors.green03,
              borderWidth: 1.5,
            }}
            titleStyle={{
              color: colors.green03,
              fontWeight: '400',
              fontSize: 14
            }}
            containerStyle={{ width: '40%', height: 40, marginTop: 30 }}
            type="outline"
            title="Apply"
            onPress={() => {
              this.setState({ isPriceOverylayVisible: false });
              this.fetchSearch();
            }}
          />
        </View>
      </Overlay>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.flexContainer}>
          <View style={styles.flexContainer}>
            <Animated.View style={{
              height: this.startHeaderHeight,
              backgroundColor: 'white',
              justifyContent: 'center',
            }}>
              <Animated.View style={{ top: this.searchBarHeight, zIndex: 1 }}>
                <SearchBar updateSearch={this.updateSearch} fetchSearch={this.fetchSearch}/>
              </Animated.View>

              <Animated.View style={{ 
                flexDirection: 'row', 
                marginHorizontal: 24, 
                position: 'relative', 
                top: this.animatedTagTop, 
                opacity: this.animatedOpacity,
                }}
              >
                <TouchableOpacity style={{ 
                    minHeight: 20, 
                    minWidth: 40, 
                    padding: 5, 
                    marginRight: 5,
                    backgroundColor: 'white', 
                    borderColor: colors.gray03,
                    borderWidth: 1,
                    borderRadius: 25,
                  }}
                  onPress={() => this.setState({isDistanceOverylayVisible: true})}
                >
                  <Text style={{ 
                    fontSize: 10,
                    fontWeight: '600',
                    color: colors.gray04,
                    padding: 5,
                  }}
                  >
                    Distance
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ 
                    minHeight: 20, 
                    minWidth: 40, 
                    padding: 5, 
                    marginRight: 5,
                    backgroundColor: 'white', 
                    borderColor: colors.gray03,
                    borderWidth: 1,
                    borderRadius: 25,
                  }}
                  onPress={() => this.setState({isPriceOverylayVisible: true})}
                >
                  <Text style={{ 
                    fontSize: 10,
                    fontWeight: '600',
                    color: colors.gray04,
                    padding: 5,
                  }}
                  >
                    Price Range
                  </Text>
                </TouchableOpacity>
                 
                <TouchableOpacity style={{ 
                    minHeight: 20, 
                    minWidth: 40, 
                    padding: 5, 
                    marginRight: 5,
                    backgroundColor: 'white', 
                    borderColor: colors.gray03,
                    borderWidth: 1,
                    borderRadius: 25
                  }}
                  onPress={() => this.setState({isRatingOverylayVisible: true})}
                >
                  <Text style={{ 
                    fontSize: 10,
                    fontWeight: '600',
                    color: colors.gray04,
                    padding: 5,
                  }}
                  >
                    Rating
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>

            {this.renderDistancePickerOverlay()}
            {this.renderRatingPickerOverlay()}
            {this.renderPricePickerOverlay()}

            <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false} onScroll={Animated.event(
                [
                  {nativeEvent: { contentOffset: {y: this.scrollY} }}
                ]
              )}
            >
              <CategoriesList 
                categoriesList={this.props.categoriesList} 
                changeCategory={this.handleCategoryChange} 
                chosenCategory={this.state.category}
              />

              <ResultsList 
                resultList={this.state.searchResults} 
                navigation={this.props.navigation}
              />
            </ScrollView>
          </View>
      </SafeAreaView>
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
  }
}

export default connect(mapStateToProps)(ExploreScreen);
