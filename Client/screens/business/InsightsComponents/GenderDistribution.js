import React, { Component } from 'react'
import { View, FlatList} from 'react-native';
import { ListItem } from 'react-native-elements';
import { PieChart } from 'react-native-svg-charts'
import { Path, Text as Txt } from 'react-native-svg';
import styles from './Style_Statistics'

class GenderDistribution extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
        genderPie: [],
        genderSum: 0,
    };
    this.MakePie = this.MakePie.bind(this);
  }


  componentDidMount() {
    this.MakePie();
  }
  
  MakePie()
  {
    let temp = this.state.genderPie;
    for (var i = 0; i < this.props.gendercount[0].gender.length; i++)
    {
      temp.push({key: this.props.gendercount[0].gender[i],
                 value: this.props.gendercount[0].amount[i],
                 svg: { fill: this.props.colors[i] },},)
    }

    this.setState({genderPie: temp})
    this.setState({genderSum: this.props.gendercount[0].amount.reduce((a, b) => a + b, 0)})
  }

  renderItem = ({ item }) => (
    <ListItem
      title = {item.key}
      leftAvatar = {<View style={[styles.itemStyle, {backgroundColor:item.svg.fill}]}></View>}
    />
  )

  RenderPie()
  {
    if(this.state.genderPie.length > 0)
    {
      {  
        return (
          <FlatList
            keyExtractor={(item, index) => { index.toString()}}
            data={this.state.genderPie}
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
            {this.RenderPie()}
            </View>

            <PieChart
               style={{ height: 300, marginTop: -20 }}
               valueAccessor={({ item }) => item.value}
               outerRadius={'70%'}
               innerRadius={2}
               data={this.state.genderPie}
             >
             <Labels/>
             </PieChart>
        </View>
    )
  }
}
export default GenderDistribution;