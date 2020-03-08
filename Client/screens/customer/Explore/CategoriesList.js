import React, { Component } from 'react';
import { View, Text, Image, ScrollView, FlatList, SafeAreaView } from 'react-native';
import colors from '../../../constants/Colors';
import CategoryCard from '../Explore/CategoryCard';
import styles from '../../../styles/customer/Style_ExploreScreen';

export default class CategoriesList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categoriesList: data
        }
        this.renderItem = this.renderItem.bind(this);
    }

    renderItem({ item, index }) {
        return(
            <CategoryCard categoryData={item} index={index}/>
        )
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#fff',
                paddingTop: 20
            }}>
                <Text style={styles.categoriesText}>Categories</Text>
                <View style={{ height: 150, marginTop: 20 }}>
                    <FlatList
                        data={data}
                        keyExtractor={item => item.ID.toString()}
                        renderItem={this.renderItem}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>
        )
    }
}

const data = [
    {
        ID: 0,
        image: require('../../../assets/images/Categories/hairdresser.png'),
        text: 'Hairdresser'
    },
    {
        ID: 1,
        image: require('../../../assets/images/Categories/orthodontist.png'),
        text: 'Orthodontist'
    },
    {
        ID: 2,
        image: require('../../../assets/images/Categories/cosmetic.png'),
        text: 'Cosmetic'
    },
    {
        ID: 3,
        image: require('../../../assets/images/Categories/hairdresser.png'),
        text: 'Bla'
    },
    {
        ID: 4,
        image: require('../../../assets/images/Categories/hairdresser.png'),
        text: 'Bla'
    },
]