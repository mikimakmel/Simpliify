import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import colors from '../../../constants/Colors';

export default class CategoryCard extends Component {
    render() {
        return (
            <View style={{ 
                height: 130, 
                width: 130,  
                borderRadius: 10, 
                shadowOffset: { width: 0, height: 1 },
                shadowRadius: 3,
                shadowColor: colors.gray04,
                shadowOpacity: 0.25,
                elevation: 3,
                backgroundColor : 'white',
                margin: 7,
                marginLeft: this.props.index === 0 ? 24 : 7
            }}
            >
                <View style={{ flex: 2 }}>
                    <Image 
                        source={this.props.categoryData.image} 
                        style={{ flex: 1, width: null, height: null, resizeMode: 'stretch', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
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
                       {this.props.categoryData.text}
                    </Text>
                </View>
            </View>
        )
    }
}
