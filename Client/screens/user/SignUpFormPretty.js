import React, { Component } from 'react';
import { View, Text, Picker, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { Input, CheckBox } from 'react-native-elements';
import { Container, Content, DatePicker, Button } from 'native-base';
import GradientButton from 'react-native-gradient-buttons';
import Colors from '../../constants/Colors';
import { Avatar } from 'react-native-elements';

class SignUpFormPretty extends Component {
  constructor(props) {
    super(props);
    this.state = {
        firstName: '',
        lastName: '',
        phone: '',
        gender: '',
        birthday: new Date(),
        street: '',
        city: '',
        country: '',
    };
    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ birthday: newDate });
  }

  render() {
    return (
      <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
      >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: Colors.gray06}}>
        {/* <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={{ 
            padding: 15, 
            alignItems: 'center', 
            borderRadius: 5,  
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 300,
          }}
        /> */}
        <View style={{ 
            height: '35%', 
            backgroundColor: Colors.red, 
            justifyContent: 'center', 
          }}>
            <Avatar
              source={{uri: 'https://www.lococrossfit.com/wp-content/uploads/2019/02/user-icon-300x300.png'}}
              showEditButton
              rounded 
              size={120}
              containerStyle={{alignSelf: 'center', marginBottom: 30}}
            />
        </View>
        <View style={{ 
            position: 'absolute', 
            alignSelf: 'center',
            bottom: 30, 
            height: '70%', 
            width: '90%',
            backgroundColor: Colors.white, 
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 5,
            shadowColor: Colors.gray04,
            shadowOpacity: 0.3,
            elevation: 6
          }}>
            <Text style={{
              alignSelf: 'center', 
              marginTop: 15,
              fontSize: 18,
              fontWeight: '600',
              color: Colors.black,
            }}
            >
              USER PROFILE
            </Text>
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
              placeholder='Enter Address'
              errorStyle={{ color: 'red' }}
              containerStyle={{marginTop: 20, width: '90%', alignSelf: 'center'}}
              // errorMessage='ENTER A VALID ERROR HERE'
            />
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Input
                label='City'
                placeholder='Enter City'
                errorStyle={{ color: 'red' }}
                containerStyle={{marginTop: 20, width: '45%',}}
                // errorMessage='ENTER A VALID ERROR HERE'
              />
              <Input
                label='Country'
                placeholder='Enter Country'
                errorStyle={{ color: 'red' }}
                containerStyle={{marginTop: 20, width: '45%',}}
                // errorMessage='ENTER A VALID ERROR HERE'
              />
            </View>
            <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 10, alignItems: 'center', width: '80%'}}>
              <Text style={{backgroundColor: Colors.white, width: '25%', fontWeight: '600', color: Colors.gray02, marginLeft: -5}}>Gender: </Text>
              <CheckBox
                  center
                  title='Male'
                  checked={true}
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  containerStyle={{backgroundColor: Colors.white, borderWidth: 0, width: '30%', marginRight: 0}}
                  textStyle={{fontWeight: '500'}}
              />
              <CheckBox
                  center
                  title='Female'
                  checked={false}
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  containerStyle={{backgroundColor: Colors.white, borderWidth: 0, width: '40%',}}
                  textStyle={{fontWeight: '500'}}
              />
            </View>
            <View style={{alignSelf: 'center', width: '90%'}}>
              <DatePicker
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
                placeHolderTextStyle={{ color: "#d3d3d3" }}
                onDateChange={this.setDate}
                disabled={false}
              />
              {/* <Text>{this.state.birthday.toString().substr(4, 12)}</Text> */}
            </View>
            <View style={{position: 'absolute', bottom: 10, width: '100%'}}>
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
                onPressAction={() => alert('Confirmed')}
              >
                CONFIRM
              </GradientButton>
            </View>
        </View>
      </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default SignUpFormPretty;
