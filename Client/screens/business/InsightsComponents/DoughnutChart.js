import React, { Component } from 'react'
import { View, FlatList, Text} from 'react-native';
import { ListItem } from 'react-native-elements';
import { PieChart } from 'react-native-svg-charts'
import styles from './Style_Statistics'
import colors from '../../../constants/Colors';

class DoughnutChart extends Component {
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
      var amount =  (100 + this.props.data.amount[i] / 100) * 0.7
      if (amount > 150) amount = 150

      temp.push({key: this.props.data.category[i] + ' (' + this.props.data.amount[i] + ')',
                 value: this.props.data.amount[i],
                 svg: { fill: colors.redColors[(i % colors.redColors.length)] },
                 arc: { outerRadius:amount}},)
    }

    this.setState({data: temp})
  }

  renderItem = ({ item }) => (
    <View>
      <ListItem
        title = {item.key}
        leftAvatar = {<View style={[styles.itemStyle, {backgroundColor:item.svg.fill}]}></View>}
        style={{backgroundColor: item.svg.fill, marginTop: -15}}
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
              <Text style={styles.headline}>{this.props.headline}</Text>
              <Text style={styles.subHeadline}>{this.props.subHeadline}</Text>
            </View>

            <View style={styles.itemMargin}>
              {this.RenderPie()}
            </View>

            <PieChart
            style={{ height: 300, marginTop: -10 }}
            outerRadius={'70%'}
            innerRadius={60}
            data={this.state.data}
            />
      </View>
    )
  }
}
export default DoughnutChart;