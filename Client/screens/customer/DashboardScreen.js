import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        status: '',
        name: '',
        password: '',
    };
  }

  render() {
    return (
      <View>
        <Text> Welcome {this.state.name}! </Text>
        <Text> status: {this.state.status} </Text>
        <Text> password: {this.state.password} </Text>
        <Button onPress={() => {}} >Log Out</Button>
      </View>
    );
  }
}

export default DashboardScreen;
