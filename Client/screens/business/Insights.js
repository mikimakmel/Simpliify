import React, { Component } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import PercentPie from './InsightsComponents/PercentPie';
import DoughnutChart from './InsightsComponents/DoughnutChart';
import HorizontalBar from './InsightsComponents/HorizontalBar';
import LineDistribution from './InsightsComponents/LineDistribution';

class Insights extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      colors: ['#600080', '#9900cc', '#c61aff', '#d966ff', '#ecb3ff'],
      serviceincome: [{ category: ['Beauty Sales', 'Baby Legal'], amount: [80, 50], }],
      gendercount: [{ category: ['Female', 'Male'], amount: [100, 50] }],
      customersage: [{ category: ['18-24', '25-34', '44-35', '55-65', '65+'], amount: [3840, 1920, 960, 400, 400] }],
      citycount: [{ category: ['Herzelia', 'Tel Aviv', 'Rishon Lezion'], amount: [5, 2, 1] }],
      businessincome: [50, 10, 40, 95, 50, 10, 40, 195, 50, 10, 40, 95]
    };
  }

  render() {
    return(
      <SafeAreaView>
         <ScrollView>
           <DoughnutChart
             name = "Gender Distribution"
             data = {this.state.gendercount}
             colors = {this.state.colors}
           />
            <PercentPie
              name = "Income Per Service"
              data = {this.state.serviceincome}
              colors = {this.state.colors}
            />
            <HorizontalBar
              name = "Users' Age Distribution"
              data = {this.state.customersage}
              colors = {this.state.colors}
            />
            <HorizontalBar
              name = "Users' City Distribution"
              data = {this.state.citycount}
              colors = {this.state.colors}
            />
            <LineDistribution
              name = "Business's Yearly Income"
              data = {this.state.businessincome}
            />
        </ScrollView>
      </SafeAreaView>
    )
  }  
}

export default Insights;
