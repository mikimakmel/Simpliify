import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';

class CreditCardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  _onChange = (formData) => console.log(JSON.stringify(formData, null, " "));
  _onFocus = (field) => console.log("focusing", field);
  
  render() {
    // CreditCardInput.setValues({ 
    //   number: "2222 2222 2222 2222",
    //   expiry: "06/19",
    //   cvc: "222",
    //   type: "visa", 
    //   name: "Miki",
    // });
    
    const {card_number, full_name, card_type, valid_date} = this.props.route.params.cardDetails;
    console.log("number: " + card_number);

    return (
        <View style={{flex: 1, paddingTop: 100}}>
          {/* <CreditCardInput
            requiresName
            requiresCVC
            labelStyle={s.label}
            inputStyle={s.input}
            validColor={"black"}
            invalidColor={"red"}
            placeholderColor={"darkgray"}
            allowScroll={true}
            refs={(refs) => console.log(refs.CCInput)}
          /> */}
          <Text>Card Details</Text>
          <Text>Card Number: {card_number}</Text>
          <Text>Name: {full_name}</Text>
          <Text>Type: {card_type}</Text>
          <Text>Date: {valid_date}</Text>
        </View>
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