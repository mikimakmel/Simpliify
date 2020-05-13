import React, { Component } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Path, Text } from 'react-native-svg'
// import { BarChart as Bar, PieChart as Pie } from "react-native-chart-kit";
import { AreaChart, Grid, BarChart, PieChart } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

class Insights extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render () {
        const fill = 'rgba(134, 65, 244, 0.3)'
        const areaData = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
        const barData = [50, 10, 40, 95, -4, -24, null, 85, undefined, 0, 35, 53, -53, 24, 50, -20, -80]
        
        function round(value, precision) {
          var multiplier = Math.pow(10, precision || 0);
          return Math.round(value * multiplier) / multiplier;
        }

        var genderCount = [50, 100]
        var genderSum = genderCount.reduce((a, b) => a + b, 0)
        const genderPie = [
            {key: 1, amount: 50, gender: 'Male', svg: { fill: '#600080' }},
            {key: 2, amount: 100, gender: 'Female', svg: { fill: '#9900cc' }}]

        var serviceIncome = [50, 50, 40, 95, 35]
        const servicePie = [
          {key: 1, value: serviceIncome[0], svg: { fill: '#600080' }, arc: { outerRadius: 100 + serviceIncome[0] / 3,}},
          {key: 2, value: serviceIncome[1], svg: { fill: '#9900cc' }, arc: { outerRadius: 100 + serviceIncome[1] / 3,}},
          {key: 3, value: serviceIncome[2], svg: { fill: '#c61aff' }, arc: { outerRadius: 100 + serviceIncome[2] / 3,}},
          {key: 4, value: serviceIncome[3], svg: { fill: '#d966ff' }, arc: { outerRadius: 100 + serviceIncome[3] / 3,}},
          {key: 5, value: serviceIncome[4], svg: { fill: '#ecb3ff' }, arc: { outerRadius: 100 + serviceIncome[4] / 3,}}]

        const Labels = ({ slices }) => {
          return slices.map((slice, index) => {
              const { labelCentroid, pieCentroid, data } = slice;
              return (
                  <Text
                      key={index}
                      x={pieCentroid[ 0 ]}
                      y={pieCentroid[ 1 ]}
                      fill={'white'}
                      textAnchor={'middle'}
                      alignmentBaseline={'middle'}
                      fontSize={24}
                      stroke={'black'}
                      strokeWidth={0.2}
                  >
                      {String(round((data.amount / genderSum), 1) * 100 + '%')}
                  </Text>
              )
          })
      }
        
        // Bar Chart Outer Line
        const Line = ({ line }) => (
          <Path
              key={'line'}
              d={line}
              stroke={'rgb(134, 65, 244)'}
              fill={'none'}
          />
        )
        
        return (
          <SafeAreaView>
            <ScrollView>
              {/* Gender Distribution */}
              <View>
                <PieChart
                  style={{ height: 300 }}
                  valueAccessor={({ item }) => item.amount}
                  outerRadius={'70%'}
                  innerRadius={2}
                  data={genderPie}
                >
                <Labels/>
                </PieChart>
              </View>
              
              {/* Service Income Distribution */}
              <View>
                <PieChart
                  style={{ height: 300 }}
                  outerRadius={'70%'}
                  innerRadius={60}
                  data={servicePie}
                />
              </View>

              <View>
                <AreaChart
                    style={{ height: 300 }}
                    valueAccessor={({ item }) => item.amount}
                    data={areaData}
                    contentInset={{ top: 30, bottom: 30 }}
                    curve={shape.curveNatural}
                    svg={{ fill }}
                >
                    <Grid />
                    <Line/>
                </AreaChart>
              </View>

              <View>
                <BarChart
                    style={{ height: 300 }}
                    data={barData}
                    svg={{ fill }}
                    contentInset={{ top: 30, bottom: 30 }}>
                <Grid />
                <Line/>
                </BarChart>
              </View>

            </ScrollView>
          </SafeAreaView>
        )
    }
}

export default Insights;
