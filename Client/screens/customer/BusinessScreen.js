import React, { Component } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'

export default class BusinessScreen extends Component {
  render() {
    return (
        <View style={styles.container}>
            <Text>Business Screen</Text>
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});