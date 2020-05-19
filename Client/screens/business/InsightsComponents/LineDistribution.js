import React, { Component } from 'react'
import { View, Text } from 'react-native';
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts'
import styles from './Style_Statistics'

class LineDistribution extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      axesSvg: { fontSize: 10, fill: 'grey' },
      verticalContentInset: { top: 10, bottom: 10 },
      xAxisHeight: 30
    };
  }

  render() {
    return(
        <View>
            <View>
              <Text style={styles.headline}>{this.props.name}</Text>
            </View>

            <View style={{ height: 400, padding: 20, flexDirection: 'row' }}>
                <YAxis
                    data={this.props.data}
                    style={{ marginBottom: this.state.xAxisHeight }}
                    contentInset={this.state.verticalContentInset}
                    svg={this.state.axesSvg}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <LineChart
                        style={{ flex: 1 }}
                        data={this.props.data}
                        contentInset={this.state.verticalContentInset}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                    <XAxis
                        style={{ marginHorizontal: -10, height: this.state.xAxisHeight }}
                        data={this.props.data}
                        formatLabel={(value, index) => index + 1}
                        contentInset={{ left: 10, right: 10 }}
                        svg={this.state.axesSvg}
                    />
                </View>
            </View>

            <View style = {styles.horizontalLine}/>

        </View>
    )
  }
}
export default LineDistribution;