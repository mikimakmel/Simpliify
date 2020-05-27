import React, { Component } from 'react';
import { SafeAreaView, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import PercentPie from './InsightsComponents/PercentPie';
import DoughnutChart from './InsightsComponents/DoughnutChart';
import HorizontalBar from './InsightsComponents/HorizontalBar';
import LineDistribution from './InsightsComponents/LineDistribution';
import VerticalBar from './InsightsComponents/VerticalBar';
import styles from './InsightsComponents/Style_Statistics';
import route from '../../routeConfig';
import colors from '../../constants/Colors';

class Insights extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      BusinessID: 13,
      purplecolors: ['#600080', '#9900cc', '#c61aff', '#d966ff', '#ecb3ff'],
      browncolors: ['#603101', '#7a3f02', '#924b03', '#c76b0f', '#f6d193', '#fae8c9'],
      statistics: null,
      isLoading: true
    };
    this.fetchAllStatistics = this.fetchAllStatistics.bind(this);
  }

  componentDidMount() {
    this.fetchAllStatistics();
  }

  async fetchAllStatistics() {
    const { BusinessID } = this.state;

    const url = `${route}/statistics/getAllStatisticsByBusinessID`;
    const options = { 
      method: 'POST', 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({businessID: BusinessID})
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(data => {
        this.setState({statistics: data.statistics});
      })
      .catch(error => console.log(error))

    this.setState({isLoading: false});
  }

  render() {
    const { statistics, isLoading } = this.state;

    if(isLoading) {
      return(
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: colors.white }}>
          <ActivityIndicator size="large" color={colors.red}/>
        </View>
      )
    }
    else {
      return(
        <SafeAreaView>
           <ScrollView>
             <Text style={styles.headline}> {statistics.dailycounter} Page Visitors Today </Text>
             <View style = {styles.horizontalLine}/>
             <PercentPie
               name = "Gender Distribution"
               data = {statistics.gendercount}
               colors = {this.state.purplecolors}
             />
              <DoughnutChart
               name = "Income Per Service"
               data = {statistics.serviceincome}
               colors = {this.state.purplecolors}
              />
              <HorizontalBar
                name = "Customers' Age Distribution"
                data = {statistics.customersage}
                colors = {this.state.purplecolors}
              />
              <HorizontalBar
                name = "Customers' City Distribution"
                data = {statistics.citycount}
                colors = {this.state.purplecolors}
              />
              <LineDistribution
                name = "Business's Monthly Income"
                data = {statistics.businessincome}
              />
              <VerticalBar
                name = "Strongest Hours"
                data = {statistics.stronghours}
                colors = {this.state.purplecolors}
              />
              <HorizontalBar
               name = "Top 10 Customers"
               data = {statistics.bestcustomer}
               colors = {this.state.browncolors}
              />
              <LineDistribution
                name = "Rating Over Time"
                data = {statistics.ratingcount}
              />
          </ScrollView>
        </SafeAreaView>
      )
    }
  }  
}

export default Insights;
