import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import styles from '../../styles/Style_MenuScreen';
import { ListItem, Divider } from 'react-native-elements'
import colors from '../../constants/Colors';
import { AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from "react-redux";
import * as Actions_User from '../../redux/actions/Actions_User';
import * as firebase from 'firebase';
// const firebaseApp = require('../../firebaseConfig');

class MenuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    firebase.auth().signOut()
      .then(() => {
        console.log('Sign-out successful');
        this.props.navigation.navigate('LogIn');
      })
      .catch((error) => {
        console.log('An error happened: ' + error);
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.headline}>Menu</Text>
          <ListItem
              leftAvatar={{ size: 70, source: { uri: 'data:image/png;base64,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' } }}
              title={'Miki Makmel'}
              titleStyle={{ fontWeight: '600', fontSize: 18 }}
              subtitle={'See your profile'}
              subtitleStyle={{ fontWeight: '400', fontSize: 12, marginTop: 5, color: colors.gray02 }}
          />
          <Divider style={{ backgroundColor: colors.gray05, marginHorizontal: 24, height: 1 }} />
          <Text style={styles.secondaryHeadline}>Account</Text>
          <ListItem
            title={'Prsonal information'}
            titleStyle={{ fontWeight: '500', fontSize: 16 }}
            containerStyle={{ marginHorizontal: 6 }}
            chevron={(<FontAwesome name="user-o" size={25} />)}
            onPress={() => this.props.navigation.navigate('SignUpForm')}
          />
          <ListItem
            title={'Payment and billing'}
            titleStyle={{ fontWeight: '500', fontSize: 16 }}
            containerStyle={{ marginHorizontal: 6 }}
            chevron={(<AntDesign name="creditcard" size={25} />)}
            onPress={() => this.props.navigation.navigate('Scan')}
          />
          <Divider style={{ backgroundColor: colors.gray01, marginHorizontal: 24, height: 0.8 }} />
          <Text style={styles.secondaryHeadline}>Business</Text>
          {/* <ListItem
            title={'Create your business'}
            titleStyle={{ fontWeight: '500', fontSize: 16, color: colors.green01 }}
            containerStyle={{ marginHorizontal: 6 }}
            chevron={(<MaterialIcons name="business" size={25} color={colors.green01} />)}
          /> */}
          <ListItem
            title={'Switch to business'}
            titleStyle={{ fontWeight: '500', fontSize: 16, color: colors.green01 }}
            containerStyle={{ marginHorizontal: 6 }}
            chevron={(<MaterialCommunityIcons name="swap-horizontal-variant" size={25} color={colors.green01} />)}
            onPress={() => this.props.dispatch(Actions_User.changeAppView())}
          />
          <Divider style={{ backgroundColor: colors.gray01, marginHorizontal: 24, height: 0.8 }} />
          <Text style={styles.secondaryHeadline}>Support</Text>
          <ListItem
            title={'Give us feedback'}
            titleStyle={{ fontWeight: '500', fontSize: 16 }}
            containerStyle={{ marginHorizontal: 6 }}
            chevron={(<FontAwesome name="commenting-o" size={25} />)}
          />
          <Divider style={{ backgroundColor: colors.gray01, marginHorizontal: 24, height: 0.8 }} />
          <ListItem
            title={'Log Out'}
            titleStyle={{ fontWeight: '400', fontSize: 16, color: 'red' }}
            containerStyle={{ marginHorizontal: 6, marginTop: 20 }}
            onPress={() => this.signOut()}
          />
        </ScrollView>
    </SafeAreaView>
    );
  }
}


const mapStateToProps = ({ User, Customer }) => {
  return {
    hasBusiness: User.hasBusiness,
    currentUser: User.currentUser,
    favoritesList: Customer.favoritesList,
    view: User.view
  }
}

export default connect(mapStateToProps)(MenuScreen);