import React, { Component } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import PercentPie from './InsightsComponents/PercentPie';
import DoughnutChart from './InsightsComponents/DoughnutChart';
import HorizontalBar from './InsightsComponents/HorizontalBar';

class Insights extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      colors: ['#600080', '#9900cc', '#c61aff', '#d966ff', '#ecb3ff'],
      serviceincome: [{ category: ['Beauty Sales', 'Baby Legal'], amount: [50, 80], }],
      gendercount: [{ category: ['Female', 'Male'], amount: [100, 50] }],
      customersage: [{ category: ['18-24', '25-34', '44-35', '55-65', '65+'], amount: [3840, 1920, 960, 400, 400] }],
      citycount: [{ category: ['Herzelia', 'Tel Aviv', 'Rishon Lezion'], amount: [5, 2, 1] }]
    };
  }

  render() {
    return(
      <SafeAreaView>
         <ScrollView>
            <PercentPie
              data = {this.state.serviceincome}
              colors = {this.state.colors}
            />
            <DoughnutChart
              data = {this.state.gendercount}
              colors = {this.state.colors}
            />
            <HorizontalBar
              data = {this.state.customersage}
              colors = {this.state.colors}
            />
            <HorizontalBar
              data = {this.state.citycount}
              colors = {this.state.colors}
            />
        </ScrollView>
      </SafeAreaView>
    )
  }  
}

export default Insights;
