import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import colors from '../../../constants/Colors';

export default class CategoryCard extends Component {
    render() {
        return (
            <TouchableOpacity style={{ 
                height: 110, 
                width: 110,  
                borderRadius: 10, 
                shadowOffset: { width: 0, height: 1 },
                shadowRadius: this.props.chosenCategory === this.props.categoryData.label ? 4 : 3,
                shadowColor: this.props.chosenCategory === this.props.categoryData.label ? colors.blue : colors.gray04,
                shadowOpacity: this.props.chosenCategory === this.props.categoryData.label ? 0.9 : 0.25,
                elevation: 3,
                backgroundColor : 'white',
                margin: 7,
                marginLeft: this.props.index === 0 ? 24 : 7,
                borderWidth: this.props.chosenCategory === this.props.categoryData.label ? 0.25 : null,
                borderColor: this.props.chosenCategory === this.props.categoryData.label ? colors.blue : null
                }}
                onPress={() => this.props.changeCategory(this.props.categoryData.label)}
            >
                <View style={{ flex: 2, paddingTop: 5 }}>
                    <Image 
                        source={{ uri: this.props.categoryData.image }}
                        style={{ flex: 1, width: null, height: null, resizeMode: 'contain', }}
                    />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 10 }}>
                    <Text
                    style={{ 
                        color: colors.gray04,
                        fontSize: 14,
                        fontWeight: '500',
                    }}
                    >
                       {this.props.categoryData.label}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}
