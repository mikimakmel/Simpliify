import React, { Component } from 'react';
import { SafeAreaView, ScrollView, Text, View, ActivityIndicator, StatusBar } from 'react-native';
import PercentPie from './InsightsComponents/PercentPie';
import DoughnutChart from './InsightsComponents/DoughnutChart';
import HorizontalBar from './InsightsComponents/HorizontalBar';
import LineDistribution from './InsightsComponents/LineDistribution';
import VerticalBar from './InsightsComponents/VerticalBar';
import styles from './InsightsComponents/Style_Statistics';
import route from '../../routeConfig';
import colors from '../../constants/Colors';
import { connect } from 'react-redux';

class Insights extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      BusinessID: this.props.myBusiness.businessDetails.business.businessid,
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
          <StatusBar barStyle="dark-content"/>
          <Text style={styles.insightsHeadline}>Insights</Text>
          <ScrollView style={{backgroundColor: colors.gray01, marginBottom: 130}}>
            <View style={styles.viewersContainer}>
              <Text style={styles.viewers}>{statistics.dailycounter} Page Visitors Today </Text>
            </View>
            <PercentPie
              headline = "Gender Distribution"
              subHeadline = "(Customers' Gender By %)"
              data = {statistics.gendercount}
            />
            <DoughnutChart
              headline = "Income Per Service"
              subHeadline = "(Gross Income By ₪)"
              data = {statistics.serviceincome}
            />
            <HorizontalBar
              headline = "Customers' Age Distribution"
              subHeadline = "(Age Range Count By Ordered Services)"
              data = {statistics.customersage}
            />
            <HorizontalBar
              headline = "Customers' City Distribution"
              subHeadline = "(Cities Count By Ordered Services)"
              data = {statistics.citycount}
            />
            <LineDistribution
              headline = "Business's Monthly Income"
              subHeadline = "(Last Year's Gross Income By ₪)"
              data = {statistics.businessincome}
            />
            <VerticalBar
              headline = "Strongest Hours"
              subHeadline = "(Hours Range Count By Ordered Services)"
              data = {statistics.stronghours}
            />
            <HorizontalBar
              headline = "Top 10 Customers"
              subHeadline = "(Most Profitable Customers By ₪)"
              data = {statistics.bestcustomer}
            />
            <LineDistribution
              headline = "Rating Over Time"
              subHeadline = "(Last Year's Rating By Months)"
              data = {statistics.ratingcount}
            />
        </ScrollView>
        </SafeAreaView>
      )
    }
  }  
}

const mapStateToProps = ({ App, User, Customer, Business}) => {
  return {
    hasBusiness: User.hasBusiness,
    currentUser: User.currentUser,
    favoritesList: Customer.favoritesList,
    categoriesList: App.categoriesList,
    myBusiness: User.myBusiness,
    ordersList: Customer.ordersList,
  }
}

export default connect(mapStateToProps)(Insights);