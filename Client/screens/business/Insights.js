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
      BusinessID: 174,
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
        <SafeAreaView style={{backgroundColor: colors.gray01}}>
           <ScrollView>
             <Text style={styles.headline}> {statistics.dailycounter} Page Visitors Today </Text>
             <View style = {styles.horizontalLine}/>
             <PercentPie
               name = "Gender Distribution"
               data = {statistics.gendercount}
             />
              <DoughnutChart
               name = "Income Per Service"
               data = {statistics.serviceincome}
              />
              <HorizontalBar
                name = "Customers' Age Distribution"
                data = {statistics.customersage}
              />
              <HorizontalBar
                name = "Customers' City Distribution"
                data = {statistics.citycount}
              />
              <LineDistribution
                name = "Business's Monthly Income"
                data = {statistics.businessincome}
              />
              <VerticalBar
                name = "Strongest Hours"
                data = {statistics.stronghours}
              />
              <HorizontalBar
               name = "Top 10 Customers"
               data = {statistics.bestcustomer}
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
