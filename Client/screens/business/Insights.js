import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
// import { Path, Text } from 'react-native-svg';
// import * as shape from 'd3-shape';
// import * as scale from 'd3-scale';
// import ServiceIncome from './ServiceIncome';

class Insights extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      serviceincome: [{ name: ['Beauty Sales', 'Baby Legal'], amount: [50, 80], }],
      colors: ['#600080', '#9900cc', '#c61aff', '#d966ff', '#ecb3ff'],
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
    // return(
    //   <SafeAreaView>
    //      <ScrollView>
    //         <ServiceIncome
    //           serviceincome = {this.state.serviceincome}
    //           colors = {this.state.colors}
    //         />
    //     </ScrollView>
    //   </SafeAreaView>
    // )
  }
}

export default Insights;
