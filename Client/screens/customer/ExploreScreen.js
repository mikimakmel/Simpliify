import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView, Animated } from 'react-native';
import colors from '../../constants/Colors';
import styles from '../../styles/customer/Style_ExploreScreen';
import CategoriesList from '../customer/Explore/CategoriesList';
import SearchBar from '../customer/Explore/SearchBar';
import RecomendedList from '../customer/Explore/RecomendedList';

export default class ExploreScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      categoryList: [],
      isLoading: false
    }
    this.fetchCategoryList = this.fetchCategoryList.bind(this);
  }

  fetchCategoryList() {

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
              <SearchBar/>
              <Animated.View style={{ 
                flexDirection: 'row', 
                marginHorizontal: 24, 
                position: 'relative', 
                top: this.animatedTagTop, 
                opacity: this.animatedOpacity,
                }}
              >
                <View style={{ 
                    minHeight: 20, 
                    minWidth: 40, 
                    padding: 5, 
                    marginRight: 5,
                    backgroundColor: 'white', 
                    borderColor: colors.gray03,
                    borderWidth: 1,
                    borderRadius: 25,
                  }}
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
                </View>

                <View style={{ 
                    minHeight: 20, 
                    minWidth: 40, 
                    padding: 5, 
                    marginRight: 5,
                    backgroundColor: 'white', 
                    borderColor: colors.gray03,
                    borderWidth: 1,
                    borderRadius: 25,
                  }}
                >
                  <Text style={{ 
                    fontSize: 10,
                    fontWeight: '600',
                    color: colors.gray04,
                    padding: 5,
                  }}
                  >
                    Price
                  </Text>
                </View>
                 
                <View style={{ 
                    minHeight: 20, 
                    minWidth: 40, 
                    padding: 5, 
                    marginRight: 5,
                    backgroundColor: 'white', 
                    borderColor: colors.gray03,
                    borderWidth: 1,
                    borderRadius: 25
                  }}
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
                </View>
              </Animated.View>
            </Animated.View>
            <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false} onScroll={Animated.event(
                [
                  {nativeEvent: { contentOffset: {y: this.scrollY} }}
                ]
              )}
            >
              <CategoriesList />
              <RecomendedList />
            </ScrollView>
          </View>
      </SafeAreaView>
    )
  }
}
