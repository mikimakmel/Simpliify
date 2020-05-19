import React, { Component } from 'react'
import { View, FlatList} from 'react-native';
import { ListItem } from 'react-native-elements';
import { BarChart, Grid, YAxis } from 'react-native-svg-charts'
import styles from './Style_Statistics'

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
    for (var i = 0; i < this.props.data[0].category.length; i++)
    {
      temp.push({key: this.props.data[0].category[i] + ' (' + this.props.data[0].amount[i] + ')',
                 value: this.props.data[0].amount[i],
                 svg: { fill: this.props.colors[i % 5] },},)
    }

    this.setState({data: temp})
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
    return(
        <View>
            <View>
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