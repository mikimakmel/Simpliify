import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Button, Alert, ScrollView} from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import GradientButton from 'react-native-gradient-buttons';
import Colors from '../constants/Colors';
import { MaterialCommunityIcons, Octicons, MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class CreditCardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.setCardInputValues = this.setCardInputValues.bind(this);
    this.addedAlert = this.addedAlert.bind(this);
  }

  componentDidMount() {
    this.setCardInputValues();
    this.props.navigation.setOptions({
      title: 'Card Details',
      headerRight: () => (
        <Octicons 
          name="check" 
          size={35} 
          color={Colors.green03} 
          style={{marginRight: 10}} 
          onPress={(this.addedAlert)}
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

  addedAlert() {
    Alert.alert(
      'Congrats!',
      'Card added successfuly',
      [
        {
          text: 'OK',
          onPress: () => this.props.navigation.navigate('Menu')
        }
      ]
    )
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
      <KeyboardAwareScrollView extraHeight={100} style={{backgroundColor: 'white'}}>
        <View style={{flex: 1, paddingTop: 50, backgroundColor: 'white'}}>
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
        </View>
      </KeyboardAwareScrollView>
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