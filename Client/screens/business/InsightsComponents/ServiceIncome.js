import React, { Component } from 'react'
import { View, FlatList} from 'react-native';
import { ListItem } from 'react-native-elements';
import { PieChart } from 'react-native-svg-charts'
import styles from './Style_Statistics'

class ServiceIncome extends Component {
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
    for (var i = 0; i < this.props.serviceincome[0].name.length; i++)
    {
      temp.push({key: this.props.serviceincome[0].name[i],
                 value: this.props.serviceincome[0].amount[i],
                 svg: { fill: this.props.colors[i % 5] },
                 arc: { outerRadius:100 + this.props.serviceincome[0].amount[i] / 3}},)
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

            <PieChart
            style={{ height: 300, marginTop: -20 }}
            outerRadius={'70%'}
            innerRadius={60}
            data={this.state.data}
            />

        </View>
    )
  }
}
export default ServiceIncome;