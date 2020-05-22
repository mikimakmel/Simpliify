import React, { Component } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import PercentPie from './InsightsComponents/PercentPie';
import DoughnutChart from './InsightsComponents/DoughnutChart';
import HorizontalBar from './InsightsComponents/HorizontalBar';
import LineDistribution from './InsightsComponents/LineDistribution';
import VerticalBar from './InsightsComponents/VerticalBar';

class Insights extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      colors: ['#600080', '#9900cc', '#c61aff', '#d966ff', '#ecb3ff'],
      dailycounter: 9781,
      serviceincome: [{ category: ["Kids Marketing", "Computers Sales", "Movies Marketing", "Computers Legal", "Baby Legal"], amount: ["175", "25", "25", "100", "100"], }],
      gendercount: [{ category: ['Female', 'Male'], amount: [0, 0] }],
      customersage: [{ category: ['18-24', '25-34', '44-35', '55-65', '65+'], amount: [3840, 1920, 960, 400, 400] }],
      citycount: [{ category: ['Herzelia', 'Tel Aviv', 'Rishon Lezion'], amount: [5, 2, 1] }],
      businessincome: [50, 10, 40, 95, 50, 10, 40, 195, 50, 10, 40, 95],
      stronghours: [{ category: ['0-9', '9-12', '12-15', '15-18', '18-24'], amount: [4, 4, 9, 2, 0] }],
      bestcustomer: [{ category: ["Miki Makmel", "Dulciana Humpage", "Sarena Blinde", "Lovell Sellor", "Cristin Jeremiah", "Claudianus Peealess"], amount: ["250", "175", "150", "150", "125", "50"] }],
      ratingcount: [{ category: [5, 4, 3, 2, 1], amount: ["2", "3", "2", "1", "1"] }],
    };
  }

  render() {
    return(
      <SafeAreaView>
         <ScrollView>
           <DoughnutChart
             name = "Income Per Service"
             data = {this.state.serviceincome}
             colors = {this.state.colors}
             />
            <PercentPie
              name = "Gender Distribution"
              data = {this.state.gendercount}
              colors = {this.state.colors}
            />
            <HorizontalBar
              name = "Customers' Age Distribution"
              data = {this.state.customersage}
              colors = {this.state.colors}
            />
            <HorizontalBar
              name = "Customers' City Distribution"
              data = {this.state.citycount}
              colors = {this.state.colors}
            />
            <LineDistribution
              name = "Business's Monthly Income"
              data = {this.state.businessincome}
            />
            <VerticalBar
              name = "Strongest Hours"
              data = {this.state.stronghours}
              colors = {this.state.colors}
            />
        </ScrollView>
      </SafeAreaView>
    )
  }  
}

export default Insights;
