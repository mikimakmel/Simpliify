import React, { Component } from 'react';
import { View, Text, Image, ScrollView, FlatList, SafeAreaView } from 'react-native';
import colors from '../../../constants/Colors';
import CategoryCard from './CategoryCard';
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
            <CategoryCard categoryData={item} index={index} changeCategory={this.props.changeCategory} chosenCategory={this.props.chosenCategory}/>
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
                        keyExtractor={item => item.label.toString()}
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
        image: 'https://cdn0.iconfinder.com/data/icons/business-success-color/64/assessment-evaluation-512.png',
        label: 'All'
    },
    {
        image: 'data:image/png;base64,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',
        label: 'Sport'
    },
    {
        image: 'https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/6110244261553237342-256.png',
        label: 'Education'
    },
    {
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQRfcacs7ffUW5pnlhihbaoLtol3dlJARoXDxlgVcsk8WnNdtuh&usqp=CAU',
        label: 'Beauty'
    },
    {
        image: 'https://cdn0.iconfinder.com/data/icons/pets-basic-lineal-color/512/10_Dog-512.png',
        label: 'Pets'
    },
    {
        image: 'https://i.ya-webdesign.com/images/png-icons-4.png',
        label: 'Utilities'
    },
    {
        image: 'https://www.shareicon.net/data/2017/03/22/881409_health_512x512.png',
        label: 'Health'
    },
    {
        image: 'https://media.istockphoto.com/vectors/cute-kids-with-balloons-air-party-characters-icon-vector-id803735292',
        label: 'Kids'
    },
]