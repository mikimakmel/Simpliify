import React, { Component } from 'react'
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import FavoriteBusinessCard from './FavoriteBusinessCard'
import styles from '../../styles/customer/Style_HomeScreen';
import { connect } from "react-redux";
import * as ActionCreators from '../../redux/actions/Actions_HomeScreen';
import database from '../../database';

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEmpty: false,
      favoritesList: database.businesses
    }

    this.renderEmptyScreen = this.renderEmptyScreen.bind(this);
    this.renderFavoritesList = this.renderFavoritesList.bind(this);
  }

  renderEmptyScreen() {
    return (
      <View style={styles.emptyListContainer}>
        <Image source={require('../../assets/images/emptyListLogo.png')} style={styles.emptyListIcon} />
        <View style={styles.emptyListTextContainer}>
          <Text style={styles.emptyListHeadingText}>Services List is Empty</Text>
          <Text style={styles.emptyListText}>Start looking for your favorite services now!</Text>
        </View>
        <Button
          title="Find Services"
          type="outline"
          buttonStyle={styles.FindServicesButton}
          titleStyle={styles.FindServicesButtonTitle}
          // onPress={() => this.props.navigation.navigate('Search')}
        />
      </View>
    )
  }

  renderFavoritesList() {
    return (
      <FlatList
        data={this.state.favoritesList}
        keyExtractor={item => item.ID.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FavoriteBusinessCard businessData={item} navigation={this.props.navigation} />
        )}
      />
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.flexContainer}>
        <View style={styles.flexContainer}>
            <Text style={styles.heading}>My Services</Text>
            {this.state.isEmpty === true ? this.renderEmptyScreen() : this.renderFavoritesList()}
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ HomeScreen }) => {
  return {
    counter: HomeScreen.counter,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reduxIncreaseCounter: () => dispatch(ActionCreators.increaseCounter()),
    reduxDecreaseCounter: () => dispatch(ActionCreators.decreaseCounter()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

// render() {
//   return (
//       // <View style={styles.container}>
//       <SafeAreaView style={styles.container}>
//         {/* <Text>Home Screen</Text>
//         <Button
//           title={`Go to Business`}
//           onPress={() => this.props.navigation.navigate('Business')}
//         /> */}
//         {/* <View style={{flexDirection: 'row', width: 200, justifyContent: 'space-around'}}>
//           <TouchableOpacity onPress={() => this.props.reduxIncreaseCounter()}>
//             <Text>Increase</Text>
//           </TouchableOpacity>
//           <Text>{this.props.counter}</Text>
//           <TouchableOpacity onPress={() => this.props.reduxDecreaseCounter()}>
//             <Text>Decrease</Text>
//           </TouchableOpacity>
//         </View> */}
//           <SafeAreaView style={styles.flexContainer}>
//             {/* <NavigationEvents
//               onDidFocus={() => {
//                 this.initFavoritesList()
//               }}
//             /> */}
//             <View style={styles.flexContainer}>
//               <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//                 <Text style={styles.heading}>My Services</Text>
//                 {/* {this.state.isEmpty === true ? this.renderEmptyScreen() : this.renderFavoritesList()} */}
//                 <FavoriteBusinessCard />
//                 <FavoriteBusinessCard />
//                 <FavoriteBusinessCard />
//               </ScrollView>
//             </View>
//           </SafeAreaView>
//       </SafeAreaView>
//       // </View>
//   )
// }