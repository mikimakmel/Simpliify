import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView, StatusBar, Image } from 'react-native';
import styles from '../../styles/Style_MenuScreen';
import { ListItem, Divider } from 'react-native-elements'
import colors from '../../constants/Colors';
import { AntDesign, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { connect } from "react-redux";
import * as Actions_User from '../../redux/actions/Actions_User';
import * as firebase from 'firebase';
// const firebaseApp = require('../../firebaseConfig');
import { BarIndicator } from 'react-native-indicators';

class MenuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.signOut = this.signOut.bind(this);
    this.handleSwitchView = this.handleSwitchView.bind(this);
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

  async handleSwitchView() {
    await this.setState({loading: true});
    setTimeout(() => {
      this.props.dispatch(Actions_User.changeAppView())
      this.setState({loading: false});
   },1000);
  }

  render() {
    let profilepic = this.props.currentUser.profilepic;

    if(this.state.loading) {
      return(
        <View style={{ flex: 1, backgroundColor: 'white', alignContent: 'center', justifyContent: 'center'}}>
          <Image source={require('../../assets/images/logo.png')} style={{alignSelf: 'center', bottom: 50}}/>
          <BarIndicator color={colors.red} count={5} size={32} style={{position: 'absolute', bottom: 150, alignSelf: 'center'}}/>
        </View>
      )
    }
    else{
      return (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content"/>
          <Text style={styles.headline}>Menu</Text>
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <ListItem
              leftAvatar={{ size: 70, source: { uri: profilepic ?  profilepic : 'https://www.lococrossfit.com/wp-content/uploads/2019/02/user-icon-300x300.png'} }}
              title={`${this.props.currentUser.firstname} ${this.props.currentUser.lastname}`}
              titleStyle={{ fontWeight: '600', fontSize: 20, color: colors.lightBlack}}
              subtitleStyle={{ fontWeight: '400', fontSize: 12, marginTop: 5, color: colors.gray02 }}
            />
            <Divider style={{ backgroundColor: colors.gray05, marginHorizontal: 24, height: 1 }} />
            <Text style={styles.secondaryHeadline}>Account</Text>
            <ListItem
              title={'Prsonal information'}
              titleStyle={{ fontWeight: '500', fontSize: 16, marginLeft: 5 }}
              containerStyle={{}}
              chevron={(<FontAwesome name="user-o" size={25} style={{marginRight: 5}}/>)}
              onPress={() => this.props.navigation.navigate('SignUpForm', {currentUser: this.props.currentUser, hasProfile: true})}
              underlayColor={colors.red}
            />
            <ListItem
              title={'Payment and billing'}
              titleStyle={{ fontWeight: '500', fontSize: 16, marginLeft: 5 }}
              containerStyle={{}}
              chevron={(<AntDesign name="creditcard" size={25} style={{marginRight: 5}}/>)}
              onPress={() => this.props.navigation.navigate('Scan')}
              underlayColor={colors.red}
            />
            <Divider style={{ backgroundColor: colors.gray01, marginHorizontal: 24, height: 0.8 }} />
            <Text style={styles.secondaryHeadline}>Business</Text>
            {this.props.myBusiness ? 
              <ListItem
                title={this.props.view === 'Customer' ? 'Switch to business view' : 'Switch to customer view'}
                titleStyle={{ fontWeight: '500', fontSize: 16, color: colors.green01, marginLeft: 5 }}
                containerStyle={{}}
                chevron={(<MaterialCommunityIcons name="swap-horizontal-variant" size={25} color={colors.green01} style={{marginRight: 5}}/>)}
                onPress={() => this.handleSwitchView()}
                underlayColor={colors.green03}
              />
              :
              <ListItem
                title={'Create your own business'}
                titleStyle={{ fontWeight: '500', fontSize: 16, color: colors.green01, marginLeft: 5 }}
                containerStyle={{}}
                chevron={(<MaterialIcons name="business" size={28} color={colors.green01} style={{marginRight: 5}}/>)}
                onPress={() => this.props.navigation.navigate('BusinessForm')}
                underlayColor={colors.green03}
              />
            }
            <Divider style={{ backgroundColor: colors.gray01, marginHorizontal: 24, height: 0.8 }} />
            <Text style={styles.secondaryHeadline}>Support</Text>
            <ListItem
              title={'Give us feedback'}
              titleStyle={{ fontWeight: '500', fontSize: 16, marginLeft: 5  }}
              containerStyle={{}}
              chevron={(<FontAwesome name="commenting-o" size={25} style={{marginRight: 5}}/>)}
              underlayColor={colors.red}
            />
            <Divider style={{ backgroundColor: colors.gray01, marginHorizontal: 24, height: 0.8 }} />
            <ListItem
              title={'Log out'}
              titleStyle={{ fontWeight: '500', fontSize: 16, color: colors.lightBlack, marginLeft: 5 }}
              containerStyle={{ marginTop: 20 }}
              chevron={(<AntDesign name="logout" size={25} color={colors.lightBlack} style={{marginRight: 5}}/>)}
              onPress={() => this.signOut()}
              underlayColor={colors.red}
            />
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}

const mapStateToProps = ({ User, Customer, App }) => {
  return {
    view: User.view,
    currentUser: User.currentUser,
    myBusiness: User.myBusiness,
    favoritesList: Customer.favoritesList,
    categoriesList: App.categoriesList,
  }
}

export default connect(mapStateToProps)(MenuScreen);
