import React, { Component } from 'react';
import { View, Text, SafeAreaView } from 'react-native';

class Insights extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 32}}> Insights </Text>
        </View>
      </SafeAreaView>
    );
  }
}

export default Insights;
