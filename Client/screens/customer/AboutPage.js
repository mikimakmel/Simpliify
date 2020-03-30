import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Avatar, Rating, Divider } from 'react-native-elements';
import PhoneCall from 'react-native-phone-call';
// import { Popup } from 'react-native-map-link'
import colors from '../../constants/Colors';
import styles from '../../styles/customer/Style_AboutPage';
import ViewMoreText from 'react-native-view-more-text';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import MapView from 'react-native-maps';
import { AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.renderViewMore = this.renderViewMore.bind(this);
    this.renderViewLess = this.renderViewLess.bind(this);
    this.handleRatingPress = this.handleRatingPress.bind(this);
  }

  renderViewMore(onPress) {
    return (
      <Text onPress={onPress} style={{ color: colors.blue, opacity: 0.9, fontSize: 12 }}>
        View more
      </Text>
    )
  }
  renderViewLess(onPress) {
    return (
      <Text onPress={onPress} style={{ color: colors.blue, opacity: 0.9, fontSize: 12 }}>
        View less
      </Text>
    )
  }

  renderOpeningHours() {
    return (
      <View>
        <Collapse
          isCollapsed={this.state.isCollapsed}
          onToggle={isCollapsed => this.setState({ isCollapsed })}
        >
          <CollapseHeader style={[styles.rowItems, styles.leftAlign, styles.infoRowsContainer]}>
            <View style={styles.iconsCircle}>
              <FontAwesome name="clock-o" size={24} color={colors.blue} style={{ marginLeft: 1 }} />
            </View>
            <Text style={styles.iconsText}>Open - Closes</Text>
            <View style={{ paddingLeft: 10 }}>
              {this.state.isCollapsed === true ? (
                <FontAwesome name="chevron-up" size={16} color={'grey'} />
              ) : (
                <FontAwesome name="chevron-down" size={16} color={'grey'} />
              )}
            </View>
          </CollapseHeader>
          <CollapseBody style={{ marginBottom: 5, marginTop: -8 }}>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Sunday</Text>
              <Text style={styles.hoursText}>{this.props.businessData.Availability.Sunday}</Text>
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Monday</Text>
              <Text style={styles.hoursText}>{this.props.businessData.Availability.Monday}</Text>
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Tuesday</Text>
              <Text style={styles.hoursText}>{this.props.businessData.Availability.Tuesday}</Text>
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Wednesday</Text>
              <Text style={styles.hoursText}>{this.props.businessData.Availability.Wednesday}</Text>
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Thursday</Text>
              <Text style={styles.hoursText}>{this.props.businessData.Availability.Thursday}</Text>
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Friday</Text>
              <Text style={styles.hoursText}>{this.props.businessData.Availability.Friday}</Text>
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Saturday</Text>
              <Text style={styles.hoursText}>{this.props.businessData.Availability.Saturday}</Text>
            </View>
          </CollapseBody>
        </Collapse>
      </View>
    )
  }

  handleRatingPress() {
    Alert.alert('Your rating was sent successfully', null, [{ text: 'OK' }], { cancelable: false })
  }


  render() {
    return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.heading}>{this.props.businessData.Name}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Rating
              style={styles.rating}
              imageSize={22}
              readonly={!this.props.isInUserFavorites}
              startingValue={this.props.businessData.Ranking}
              onFinishRating={this.handleRatingPress}
              ratingColor={'#FED56B'}
              type={'custom'}
            />
            <Text style={{ color: 'grey', fontSize: 12, marginLeft: 4, marginTop: 3 }}>(87)</Text>
          </View>
          <View style={[{ flexDirection: 'row' }, styles.managerWordContainer]}>
            <Avatar
              containerStyle={styles.managerAvatar}
              rounded
              size={50}
              source={{ uri: this.props.businessData.Pictures.Avatar }}
            />
            <View style={styles.managerTextContainer}>
              <ViewMoreText
                numberOfLines={3}
                renderViewMore={this.renderViewMore}
                renderViewLess={this.renderViewLess}
              >
                <Text adjustsFontSizeToFit style={styles.managerText}>
                  {this.props.businessData.Description}
                </Text>
              </ViewMoreText>
            </View>
          </View>
          <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
          </View>
          <TouchableOpacity
            style={[styles.rowItems, styles.leftAlign, styles.infoRowsContainer]}
            onPress={() => {
              const args = {
                number: '0525368689',
                prompt: false
              }
              PhoneCall(args).catch(console.error)
            }}
          >
            <View style={styles.iconsCircle}>
              <FontAwesome name="phone" size={24} color={colors.blue} style={{ marginLeft: 1 }} />
            </View>
            <Text style={styles.iconsText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rowItems, styles.leftAlign, styles.infoRowsContainer]}
            onPress={() => {
              Linking.openURL('https://google.com')
            }}
          >
            <View style={styles.iconsCircle}>
              <FontAwesome name="globe" size={24} color={colors.blue} style={{ marginLeft: 2 }} />
            </View>
            <Text style={styles.iconsText}>Website</Text>
          </TouchableOpacity>
          {this.renderOpeningHours()}
          <View style={[styles.rowItems, styles.leftAlign, styles.infoRowsContainer]}>
            <View style={styles.iconsCircle}>
              <FontAwesome name="tags" size={23} color={colors.blue} style={{ marginLeft: 3 }} />
            </View>
            <Text style={styles.iconsText}>
              {this.props.businessData.Tags[0] +
                ', ' +
                this.props.businessData.Tags[1] +
                ', ' +
                this.props.businessData.Tags[2]}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.rowItems, styles.leftAlign, styles.infoRowsContainer]}
            onPress={() => {
            //   this.setState({ isPopupVisble: true })
            }}
          >
            <View style={styles.iconsCircle}>
              <FontAwesome
                name="map-marker"
                size={24}
                color={colors.blue}
                style={{ marginLeft: 1 }}
              />
            </View>
            <Text style={styles.iconsText}>{this.props.businessData.Location.Address}</Text>
          </TouchableOpacity>
          {/* <Popup
            isVisible={this.state.isPopupVisble}
            onCancelPressed={() => this.setState({ isPopupVisble: false })}
            onAppPressed={() => this.setState({ isPopupVisble: false })}
            onBackButtonPressed={() => this.setState({ isPopupVisble: false })}
            modalProps={{
              animationIn: 'slideInUp'
            }}
            appsWhiteList={[]}
            options={{
              alwaysIncludeGoogle: true,
              latitude: this.props.businessData.Location.Lat,
              longitude: this.props.businessData.Location.Lon,
              title: this.props.businessData.Name,
              dialogTitle: 'Navigate With',
              cancelText: 'Cancel'
            }}
          /> */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={{
                latitude: this.props.businessData.Location.Lat,
                latitudeDelta: 0.002,
                longitude: this.props.businessData.Location.Lon,
                longitudeDelta: 0.002
              }}
              provider={'google'}
              zoomTapEnabled
            >
              <MapView.Marker
                coordinate={{
                  latitude: this.props.businessData.Location.Lat,
                  longitude: this.props.businessData.Location.Lon
                }}
              />
            </MapView>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default AboutPage;
