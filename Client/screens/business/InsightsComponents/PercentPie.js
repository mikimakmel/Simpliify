import React, { Component } from 'react'
import { View, FlatList, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { PieChart } from 'react-native-svg-charts'
import { Text as Txt } from 'react-native-svg';
import styles from './Style_Statistics'
import colors from '../../../constants/Colors';

class PercentPie extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
        data: [],
        genderSum: 0,
    };
    this.MakeGraph = this.MakeGraph.bind(this);
  }


  componentDidMount() {
    this.MakeGraph();
  }
  
  MakeGraph()
  {
    let temp = this.state.data;
    for (var i = 0; i < this.props.data.category.length; i++)
    {
      temp.push({key: this.props.data.category[i] + ' (' + this.props.data.amount[i] + ')',
      value: this.props.data.amount[i],
      svg: { fill: colors.redColors[(i % colors.redColors.length) * 2] },},)
    }
    
    this.setState({data: temp})
    this.setState({genderSum: this.props.data.amount.reduce((a, b) => a + b, 0)})
  }

  renderItem = ({ item }) => (
    <View>
      <ListItem
        title = {item.key}
        leftAvatar = {<View style={[styles.itemStyle, {backgroundColor:item.svg.fill}]}></View>}
        style={{backgroundColor: item.svg.fill}}
      />
       <View style = {styles.horizontalLine}/>
    </View>
  )

  RenderPie()
  {
    if(this.state.data.length > 0)
    {
      {  
        return (
          <FlatList
            keyExtractor={(item, index) => { index.toString()}}
            data={this.state.data}
            renderItem={this.renderItem}
          />
        )
      }
    }
  }

  render() {
    function round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }

    const Labels = ({ slices }) => {
      return slices.map((slice, index) => {
        const { labelCentroid, pieCentroid, data } = slice;
        return (
            <Txt
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
              {String(round((data.value / this.state.genderSum), 2) * 100 + '%')}
            </Txt>
        )
      })
    }

    return(
        <View style={styles.chart}>
            <View>
              <Text style={styles.headline}>{this.props.name}</Text>
            </View>

            <View style={styles.itemMargin}>
              {this.RenderPie()}
            </View>

            <PieChart
               style={{ height: 300, marginTop: -20 }}
               valueAccessor={({ item }) => item.value}
               outerRadius={'83%'}
               innerRadius={2}
               data={this.state.data}
             >
             <Labels/>
             </PieChart>
        </View>
    )
  }
}
export default PercentPie;