import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import ServiceIncome from './InsightsComponents/ServiceIncome';
import GenderDistribution from './InsightsComponents/GenderDistribution';
import AgeDistribution from './InsightsComponents/AgeDistribution';

class Insights extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      colors: ['#600080', '#9900cc', '#c61aff', '#d966ff', '#ecb3ff'],
      serviceincome: [{ name: ['Beauty Sales', 'Baby Legal'], amount: [50, 80], }],
      gendercount: [{ gender: ['Female', 'Male'], amount: [100, 50] }],
      customersage: [{age: ['18-24', '25-34', '44-35', '55-65', '65+'], amount: [3840, 1920, 960, 400, 400],}]
    };
  }


  render() {
    return(
      <SafeAreaView>
         <ScrollView>
            <ServiceIncome
              serviceincome = {this.state.serviceincome}
              colors = {this.state.colors}
            />
            <GenderDistribution
              gendercount = {this.state.gendercount}
              colors = {this.state.colors}
            />
            <AgeDistribution
              customersage = {this.state.customersage}
              colors = {this.state.colors}
            />
        </ScrollView>
      </SafeAreaView>
    )
  }  
}

export default Insights;
