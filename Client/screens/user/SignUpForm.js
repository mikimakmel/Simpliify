import React, { Component } from 'react';
import { View, Text, Picker, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { Input, CheckBox } from 'react-native-elements';
// import { Container, Content, DatePicker, Button } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import GradientButton from 'react-native-gradient-buttons';
import Colors from '../../constants/Colors';
import { Avatar } from 'react-native-elements';
import { MaterialCommunityIcons, Octicons, MaterialIcons } from '@expo/vector-icons';

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email: 'email',
        firstName: '',
        lastName: '',
        phone: '',
        gender: '',
        dateOfBirth: new Date(),
        street: '',
        city: '',
        country: '',
        maleChecked: false,
        femaleChecked: false,
    };
    this.setDateOfBirth = this.setDateOfBirth.bind(this);
    this.handleMalePress = this.handleMalePress.bind(this);
    this.handleFemalePress = this.handleFemalePress.bind(this);
    this.fetchProfile = this.fetchProfile.bind(this);
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
          // onPress={(this.addedAlert)}
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
  }

  setDateOfBirth(newDate) {
    console.log(newDate)
    this.setState({ dateOfBirth: newDate });
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

  // printProfile() {
  //   console.log(
  //     '//////////////////////////////////////////////' + '\n' +
  //     'firstName: ' + this.state.firstName + '\n' +
  //     'lastName: ' + this.state.lastName + '\n' +
  //     'phone: ' + this.state.phone + '\n' +
  //     'street: ' + this.state.street + '\n' +
  //     'city: ' + this.state.city + '\n' +
  //     'country: ' + this.state.country + '\n' +
  //     'gender: ' + this.state.gender + '\n' +
  //     'dateOfBirth: ' + this.state.dateOfBirth + '\n' +
  //     '//////////////////////////////////////////////'
  //   )
  // }

  async fetchProfile() {
    const user = {
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

    console.log(this.state.dateOfBirth)
    const url = 'http://192.168.1.198:3000/user/createNewUser';
    const options = { 
        method: 'POST', 
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
      .then(data => console.log(data))
      .catch(error => console.log(error))
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{padding: 24, flex: 1, justifyContent: 'space-evenly'}}>
              <Avatar
                source={{uri: 'https://www.lococrossfit.com/wp-content/uploads/2019/02/user-icon-300x300.png'}}
                showEditButton
                rounded 
                size={120}
                containerStyle={{alignSelf: 'center', marginBottom: 10}}
              />
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <Input
                  label='First Name'
                  placeholder='Enter Name'
                  errorStyle={{ color: 'red' }}
                  containerStyle={{marginTop: 20, width: '45%',}}
                  // errorMessage='ENTER A VALID ERROR HERE'
                  onChangeText={text => this.setState({firstName: text})}
                />
                <Input
                  label='Last Name'
                  placeholder='Enter Name'
                  errorStyle={{ color: 'red' }}
                  containerStyle={{marginTop: 20, width: '45%',}}
                  // errorMessage='ENTER A VALID ERROR HERE'
                  onChangeText={text => this.setState({lastName: text})}
                />
              </View>
              <Input
                label='Mobile Phone'
                placeholder='Enter Phone Number'
                errorStyle={{ color: 'red' }}
                containerStyle={{marginTop: 20, width: '90%', alignSelf: 'center'}}
                // errorMessage='ENTER A VALID ERROR HERE'
                onChangeText={text => this.setState({phone: text})}
                keyboardType='numeric'
              />
              <Input
                label='Address'
                placeholder='Enter Home Address'
                errorStyle={{ color: 'red' }}
                containerStyle={{marginTop: 20, width: '90%', alignSelf: 'center'}}
                // errorMessage='ENTER A VALID ERROR HERE'
                onChangeText={text => this.setState({street: text})}
              />
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <Input
                  label='City'
                  placeholder='Enter City'
                  errorStyle={{ color: 'red' }}
                  containerStyle={{marginTop: 20, width: '45%',}}
                  // errorMessage='ENTER A VALID ERROR HERE'
                  onChangeText={text => this.setState({city: text})}
                />
                <Input
                  label='Country'
                  placeholder='Enter Country'
                  errorStyle={{ color: 'red' }}
                  containerStyle={{marginTop: 20, width: '45%',}}
                  // errorMessage='ENTER A VALID ERROR HERE'
                  onChangeText={text => this.setState({country: text})}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        <View style={{justifyContent: 'space-evenly'}}>
          <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center',}}>
            <Text style={{backgroundColor: Colors.white, fontWeight: '600', color: Colors.gray02, marginLeft: 10}}>Gender:</Text>
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
          <View style={{alignSelf: 'center', alignItems: 'center', width: '100%', marginTop: 5}}>
            {/* <DatePicker
              defaultDate={new Date()}
              minimumDate={new Date(1920, 1, 1)}
              maximumDate={new Date()}
              locale={"en"}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              animationType={"fade"}
              androidMode={"default"}
              placeHolderText="Date Of Birth"
              textStyle={{ color: "green" }}
              placeHolderTextStyle={{ color: "#d3d3d3", fontSize: 18, fontWeight: '500' }}
              onDateChange={this.setDateOfBirth}
              disabled={false}
            /> */}
            <DateTimePicker
              testID="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              value={new Date()}
              minimumDate={new Date(1920, 0, 1)}
              mode={'date'}
              // is24Hour={true}
              display="default"
              onChange={this.setDateOfBirth}
            />
          </View>
          {/* <View style={{width: '100%', paddingTop: 20, paddingBottom: 10}}>
            <GradientButton
              gradientBegin="#7F81D6"
              gradientEnd="#90E4E4"
              gradientDirection="diagonal" 
              style={{ marginVertical: 8, alignSelf: 'center',}}
              textStyle={{ fontSize: 20, fontWeight: '600' }}
              height={45}
              width={'90%'}
              radius={10}
              impact={true}
              impactStyle={'Medium'}
              onPressAction={this.fetchProfile}
            >
              CONFIRM
            </GradientButton>
          </View> */}
        </View>
      </SafeAreaView>
    );
  }
}

export default SignUpForm;
