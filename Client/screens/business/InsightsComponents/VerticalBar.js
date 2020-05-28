import React, { Component } from 'react'
import { View, FlatList, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { BarChart, XAxis, Grid } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import styles from './Style_Statistics'
import colors from '../../../constants/Colors';

class VerticalBar extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
        data: [],
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
                 svg: { fill: colors.redColors[(i % colors.redColors.length)] },},)
    }

    this.setState({data: temp})
  }
  
  renderItem = ({ item }) => (
    <View>
      <ListItem
        title = {item.key}
        leftAvatar = {<View style={[styles.itemStyle, {backgroundColor:item.svg.fill}]}></View>}
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
    return(
      <View style={styles.chart}>
            <View>
              <Text style={styles.headline}>{this.props.name}</Text>
            </View>

            <View style={styles.itemMargin}>
              {this.RenderPie()}
            </View>

            <View style={{ height: 300, paddingVertical: 16 }}>
                <BarChart
                    style={{ flex: 1 }}
                    data={ this.state.data }
                    yAccessor={({ item }) => item.value}
                    gridMin={0}
                >
                    <Grid direction={Grid.Direction.HORIZONTAL}/>
                </BarChart>
                <XAxis
                    style={{ marginTop: 10 }}
                    data={ this.state.data }
                    scale={scale.scaleBand}
                    xAccessor={({ item }) => item.key}
                    labelStyle={ { color: 'black' } }
                />
            </View>
        </View>
    )
  }
}
export default VerticalBar;