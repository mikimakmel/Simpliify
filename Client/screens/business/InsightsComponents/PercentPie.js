import React, { Component } from 'react'
import { View, FlatList, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { PieChart } from 'react-native-svg-charts'
import { Path, Text as Txt } from 'react-native-svg';
import styles from './Style_Statistics'

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
      svg: { fill: this.props.colors[i % this.props.colors.length] },},)
    }
    
    this.setState({data: temp})
    this.setState({genderSum: this.props.data.amount.reduce((a, b) => a + b, 0)})
  }

  renderItem = ({ item }) => (
    <ListItem
      title = {item.key}
      leftAvatar = {<View style={[styles.itemStyle, {backgroundColor:item.svg.fill}]}></View>}
    />
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
        <View>
            <View>
              <Text style={styles.headline}>{this.props.name}</Text>
            </View>

            <View>
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

             <View style = {styles.horizontalLine}/>
        </View>
    )
  }
}
export default PercentPie;