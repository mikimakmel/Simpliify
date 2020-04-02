import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Button, Alert } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import GradientButton from 'react-native-gradient-buttons';
import Colors from '../constants/Colors';

class CreditCardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.setCardInputValues = this.setCardInputValues.bind(this);
  }
  componentDidMount() {
    this.setCardInputValues();
  }

  setCardInputValues(){
    const { card_number, full_name, card_type, valid_date } = this.props.route.params.cardDetails;
    const values = {
      number: card_number,
      expiry: valid_date,
      cvc: "CVC",
      type: card_type, 
      name: full_name,
    };
    // const values = {
    //   number: "2222 2222 2222 2222",
    //   expiry: "06/19",
    //   cvc: "222",
    //   type: "visa", 
    //   name: "Miki",
    // };
    console.log("values = " + JSON.stringify(values));
    this.cardInput.setValues(values);
  }

  _onChange = (formData) => console.log(JSON.stringify(formData, null, " "));
  _onFocus = (field) => console.log("focusing", field);
  
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{flex: 1, paddingTop: 100, backgroundColor: 'white'}}>
          <CreditCardInput
            autoFocus={false}
            requiresName
            requiresCVC
            labelStyle={s.label}
            inputStyle={s.input}
            validColor={"black"}
            invalidColor={"red"}
            placeholderColor={"darkgray"}
            allowScroll={true}
            ref={cardInput => this.cardInput = cardInput}
            labelStyle={{fontSize: 12, fontWeight: '600', color: Colors.gray03}}
            inputStyle={{fontSize: 16, fontWeight: '700', color: Colors.black}}
            placeholderColor={Colors.gray02}
          />
          
          <View style={{position: 'absolute', bottom: 30, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
            <GradientButton
              // blueViolet   
              gradientBegin="#7F81D6"
              gradientEnd="#90E4E4"
              gradientDirection="diagonal" 
              style={{ marginVertical: 8 }}
              textStyle={{ fontSize: 20, fontWeight: '600' }}
              height={50}
              width={'80%'}
              radius={10}
              impact={true}
              impactStyle={'Medium'}
              onPressAction={() => alert('Confirmed')}
            >
              SAVE CHANGES
            </GradientButton>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default CreditCardScreen;

const s = StyleSheet.create({
  switch: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 60,
  },
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
});