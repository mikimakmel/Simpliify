import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import ServiceIncome from './InsightsComponents/ServiceIncome';
import GenderDistribution from './InsightsComponents/GenderDistribution';

class Insights extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      colors: ['#600080', '#9900cc', '#c61aff', '#d966ff', '#ecb3ff'],
      serviceincome: [{ name: ['Beauty Sales', 'Baby Legal'], amount: [50, 80], }],
      gendercount: [{ gender: ['Female', 'Male'], amount: [100, 50] }],
    };
  }


  render() {
    return(
      <SafeAreaView>
         <ScrollView>
<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
<Text style={{fontSize: 32}}> Insights </Text>
</View>
            {/* <ServiceIncome
              serviceincome = {this.state.serviceincome}
              colors = {this.state.colors}
            />
            <GenderDistribution
              gendercount = {this.state.gendercount}
              colors = {this.state.colors}
            /> */}
        </ScrollView>
      </SafeAreaView>
    )
  }  
}

export default Insights;
