import React, { Component } from 'react'
import { View, FlatList, Text} from 'react-native';
import { ListItem } from 'react-native-elements';
import { BarChart, Grid } from 'react-native-svg-charts'
import styles from './Style_Statistics'
import colors from '../../../constants/Colors';

class HorizontalBar extends Component {
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

        <View style={{ flexDirection: 'row', height: 300, paddingVertical: 16 }}>
          <BarChart
              style={{ flex: 1, marginLeft: 8, marginRight: 8 }}
              data={this.state.data}
              horizontal={true}
              yAccessor={({ item }) => item.value}
              contentInset={{ top: 10, bottom: 10 }}
              spacing={0.2}
              gridMin={0}
          >
              <Grid direction={Grid.Direction.VERTICAL}/>
          </BarChart>
        </View>
    </View>
    )
  }
}
export default HorizontalBar;