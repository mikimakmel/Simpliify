import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../constants/Colors';
import styles from '../../../styles/customer/Style_ExploreScreen';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        searchQuery: '',
    };
    this.updateSearch = this.updateSearch.bind(this);
  }

  updateSearch(searchQuery) {
    this.setState({ searchQuery })
    if (searchQuery !== '') {
      // this.handleSearch(searchQuery)
    }
  }

  render() {
    return (
        <View style={styles.searchContainer}>
            <Ionicons
            name="ios-search"
            size={24}
            style={styles.searchIcon}
            color={colors.gray04}
            />
            <TextInput
            placeholder="I'm looking for..."
            placeholderTextColor={colors.red}
            underlineColorAndroid="transparent"
            style={styles.textInputBox}
            onChangeText={text => this.updateSearch(text)}
            value={this.state.searchQuery}
            />
            {this.state.searchQuery !== '' ? (
            <Ionicons
                name="ios-close-circle"
                onPress={() => this.updateSearch('')}
                size={20}
                style={styles.closeIcon}
                color={colors.gray04}
            />
            ) : null}
        </View>
    );
  }
}

export default SearchBar;
