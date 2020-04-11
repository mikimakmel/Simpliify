import React, { Component } from 'react';
import { View, Text, Picker } from 'react-native';
import { Input, CheckBox } from 'react-native-elements';
import { Container, Content, DatePicker, Button } from 'native-base';
import GradientButton from 'react-native-gradient-buttons';

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        firstName: '',
        lastName: '',
        phone: '',
        chosenDate: new Date(),
    };
    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <Input
            label='First Name'
            placeholder='Enter Text here'
            errorStyle={{ color: 'red' }}
            // errorMessage='ENTER A VALID ERROR HERE'
        />
        <Input
            label='Last Name'
            placeholder='Enter Text here'
            errorStyle={{ color: 'red' }}
            // errorMessage='ENTER A VALID ERROR HERE'
        />
        <Input
            label='Phone'
            placeholder='Enter Text here'
            errorStyle={{ color: 'red' }}
            // errorMessage='ENTER A VALID ERROR HERE'
        />
        <CheckBox
            center
            title='Male'
            checked={true}
        />
        <CheckBox
            center
            title='Female'
            checked={false}
        />
        <DatePicker
            defaultDate={new Date(2018, 4, 4)}
            minimumDate={new Date(1920, 1, 1)}
            maximumDate={new Date(2020, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Birthday"
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            onDateChange={this.setDate}
            disabled={false}
        />
        <Text>Birthday: {this.state.chosenDate.toString().substr(4, 12)}</Text>
        <GradientButton
            gradientBegin="#7F81D6"
            gradientEnd="#90E4E4"
            gradientDirection="diagonal" 
            style={{ marginVertical: 8 }}
            textStyle={{ fontSize: 20, fontWeight: '600' }}
            height={50}
            width={'90%'}
            radius={10}
            impact={true}
            impactStyle={'Medium'}
            onPressAction={() => alert('Confirmed')}
        >
            CONFIRM
        </GradientButton>
      </View>
    );
  }
}

export default SignUpForm;
