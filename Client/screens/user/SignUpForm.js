import React, { Component } from 'react';
import { View, Text, Picker, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Input, CheckBox } from 'react-native-elements';
// import { Container, Content, DatePicker, Button } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
// import GradientButton from 'react-native-gradient-buttons';
import Colors from '../../constants/Colors';
import { Avatar } from 'react-native-elements';
import { MaterialCommunityIcons, Octicons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import route from '../../routeConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Months from '../../constants/Months';
import moment from 'moment';
import * as Actions_User from '../../redux/actions/Actions_User';
import { connect } from 'react-redux';

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email: this.props.route.params.hasProfile ? this.props.route.params.currentUser.email : '',
        firstName: this.props.route.params.hasProfile ? this.props.route.params.currentUser.firstname : '',
        lastName: this.props.route.params.hasProfile ? this.props.route.params.currentUser.lastname : '',
        phone: this.props.route.params.hasProfile ? this.props.route.params.currentUser.phone : '',
        profilepic: this.props.route.params.currentUser.profilepic ? this.props.route.params.currentUser.profilepic : 'https://www.lococrossfit.com/wp-content/uploads/2019/02/user-icon-300x300.png',
        gender: this.props.route.params.hasProfile ? this.props.route.params.currentUser.gender : '',
        dateOfBirth: this.props.route.params.hasProfile ? this.props.route.params.currentUser.birthday : new Date(),
        street: this.props.route.params.hasProfile ? this.props.route.params.currentUser.street : '',
        city: this.props.route.params.hasProfile ? this.props.route.params.currentUser.city : '',
        country: this.props.route.params.hasProfile ? this.props.route.params.currentUser.country : '',
        maleChecked: this.props.route.params.currentUser.gender === 'Male' ? true : false,
        femaleChecked: this.props.route.params.currentUser.gender === 'Female' ? true : false,
        showDatePicker: false,
        prettyDate: ''
    };
    this.setDateOfBirth = this.setDateOfBirth.bind(this);
    this.handleMalePress = this.handleMalePress.bind(this);
    this.handleFemalePress = this.handleFemalePress.bind(this);
    this.createOrUpdateProfile = this.createOrUpdateProfile.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: 'User Profile',
      headerRight: () => (
        <Octicons 
          name="check" 
          size={35} 
          color={Colors.green03} 
          style={{marginRight: 10}} 
          onPress={() => {
            this.createOrUpdateProfile();
            this.props.navigation.navigate('Menu');
          }}
        />
      ),
      headerLeft: () => (
        <MaterialIcons 
          name={'keyboard-arrow-left'} 
          size={45} 
          color={Colors.blue}
          onPress={() => this.props.navigation.navigate('Menu')}
        />
      ),
    });
    this.initDate();
  }

  initDate() {
    const day = this.state.dateOfBirth.split('-')[2].substring(0,2);
    const month = Months[new Date(this.state.dateOfBirth).getMonth()];
    const year = this.state.dateOfBirth.split('-')[0];
    this.setState({prettyDate: `${day} ${month} ${year}`});
  }

  setDateOfBirth(event, date) {
    const day = moment.utc(date).format('D');
    const month = Months[moment.utc(date).format('M') - 1];
    const year = moment.utc(date).format('Y');
    this.setState({dateOfBirth: date, prettyDate: `${day} ${month} ${year}`});
  }

  handleMalePress() {
    this.setState({ 
      maleChecked: true,
      femaleChecked: false,
      gender: 'Male'
    });
  }

  handleFemalePress() {
    this.setState({ 
      maleChecked: false,
      femaleChecked: true,
      gender: 'Female'
    });
  }

  async createOrUpdateProfile() {
    const user = {
      userID: this.props.route.params.currentUser.userid,
      addressID: this.props.route.params.currentUser.addressid,
      street: this.state.street,
      city: this.state.city,
      country: this.state.country,
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phone: this.state.phone,
      birthday: this.state.dateOfBirth,
      gender: this.state.gender,
    }

    let url = this.props.route.params.hasProfile ? `${route}/user/updateUserDetails` : `${route}/user/createNewUser`;
    const options = { 
      method: this.props.route.params.hasProfile ? 'PUT' : 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(user)
    };
    const request = new Request(url, options);

    await fetch(request)
      .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong ...');
          }
        })
      .then(data => {
        console.log(data);
        // this.props.dispatch(Actions_User.updateCurrentUser(data))
      })
      .catch(error => console.log(error))
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{}} showsVerticalScrollIndicator={false}>
      <KeyboardAwareScrollView>
        <Avatar
          source={{uri: this.state.profilepic}}
          showEditButton
          rounded 
          size={100}
          containerStyle={{alignSelf: 'center', marginBottom: 20, marginTop: 20}}
        />
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <Input
            label='First Name'
            placeholder='Enter Name'
            errorStyle={{ color: 'red' }}
            containerStyle={{marginTop: 5, width: '45%',}}
            // errorMessage='ENTER A VALID ERROR HERE'
            onChangeText={text => this.setState({firstName: text})}
            value={this.state.firstName}
            labelStyle={{fontSize: 16, fontWeight: '700', color: Colors.gray03}}
          />
          <Input
            label='Last Name'
            placeholder='Enter Name'
            errorStyle={{ color: 'red' }}
            containerStyle={{marginTop: 5, width: '45%',}}
            // errorMessage='ENTER A VALID ERROR HERE'
            onChangeText={text => this.setState({lastName: text})}
            value={this.state.lastName}
            labelStyle={{fontSize: 16, fontWeight: '700', color: Colors.gray03}}
          />
        </View>
        <Input
          label='Mobile Phone'
          placeholder='Enter Phone Number'
          errorStyle={{ color: 'red' }}
          containerStyle={{marginTop: 5, width: '90%', alignSelf: 'center'}}
          // errorMessage='ENTER A VALID ERROR HERE'
          onChangeText={text => this.setState({phone: text})}
          keyboardType='numeric'
          value={this.state.phone}
          labelStyle={{fontSize: 16, fontWeight: '700', color: Colors.gray03}}
        />
        <Input
          label='Address'
          placeholder='Enter Home Address'
          errorStyle={{ color: 'red' }}
          containerStyle={{marginTop: 5, width: '90%', alignSelf: 'center'}}
          // errorMessage='ENTER A VALID ERROR HERE'
          onChangeText={text => this.setState({street: text})}
          value={this.state.street}
          labelStyle={{fontSize: 16, fontWeight: '700', color: Colors.gray03}}
        />
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <Input
            label='City'
            placeholder='Enter City'
            errorStyle={{ color: 'red' }}
            containerStyle={{marginTop: 5, width: '45%',}}
            // errorMessage='ENTER A VALID ERROR HERE'
            onChangeText={text => this.setState({city: text})}
            value={this.state.city}
            labelStyle={{fontSize: 16, fontWeight: '700', color: Colors.gray03}}
          />
          <Input
            label='Country'
            placeholder='Enter Country'
            errorStyle={{ color: 'red' }}
            containerStyle={{marginTop: 5, width: '45%'}}
            // errorMessage='ENTER A VALID ERROR HERE'
            onChangeText={text => this.setState({country: text})}
            value={this.state.country}
            labelStyle={{fontSize: 16, fontWeight: '700', color: Colors.gray03}}
          />
        </View>

        <View style={{justifyContent: 'space-evenly'}}>
          <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center',}}>
            <Text style={{backgroundColor: Colors.white, fontSize: 16, fontWeight: '700', color: Colors.gray03, marginLeft: 10}}>Gender:</Text>
            <CheckBox
                center
                title='Male'
                checked={this.state.maleChecked}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                containerStyle={{backgroundColor: Colors.white, borderWidth: 0, marginRight: 0, marginLeft: 0}}
                textStyle={{fontWeight: '500'}}
                onPress={this.handleMalePress}
            />
            <CheckBox
                center
                title='Female'
                checked={this.state.femaleChecked}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                containerStyle={{backgroundColor: Colors.white, borderWidth: 0, marginRight: 0, marginLeft: 0}}
                textStyle={{fontWeight: '500'}}
                onPress={this.handleFemalePress}
            />
          </View>
          <View style={{alignSelf: 'center', alignItems: 'center', width: '100%', marginTop: 10}}>
            <View>
              <Text style={{fontSize: 16, fontWeight: '700', color: Colors.gray03, marginBottom: 5}}>Date of Birth</Text>
              <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center', borderWidth: 0.6, borderRadius: 2, borderColor: Colors.gray04, marginBottom: this.state.showDatePicker ? null : 20}} onPress={() => {
                this.setState({showDatePicker: !this.state.showDatePicker})
              }}>
                <Text style={{padding: 10}}>{this.state.prettyDate}</Text>
                <Ionicons name={'ios-calendar'} size={30} color={Colors.gray04} style={{padding: 8}}/>
              </TouchableOpacity>
            </View>
            {
              !this.state.showDatePicker ? null :
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={this.state.dateOfBirth}
                minimumDate={new Date(1920, 0, 1)}
                mode={'date'}
                // is24Hour={true}
                display="default"
                onChange={this.setDateOfBirth}
                style={{width: '100%'}}
              />
            }
          </View>
        </View>
      </KeyboardAwareScrollView>
      </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ App, User, Customer, Business}) => {
  return {
    hasBusiness: User.hasBusiness,
    currentUser: User.currentUser,
    favoritesList: Customer.favoritesList,
    categoriesList: App.categoriesList,
    myBusiness: User.myBusiness,
    ordersList: Customer.ordersList,
  }
}

export default connect(mapStateToProps)(SignUpForm);
