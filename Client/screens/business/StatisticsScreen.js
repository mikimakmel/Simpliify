import React, { Component } from 'react';
import { LineChart, Grid } from 'react-native-svg-charts'
import colors from '../../constants/Colors';
import styles from '../../styles/business/Style_CalendarScreen';

 
class StatisticsScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
    };
  }

  render() {
      const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

      return (
          <LineChart
              style={{ height: 200 }}
              data={data}
              svg={{ stroke: 'rgb(134, 65, 244)' }}
              contentInset={{ top: 20, bottom: 20 }}
          >
              <Grid />
          </LineChart>
      )
  }
}

export default StatisticsScreen;