import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Avatar, Rating, Divider } from 'react-native-elements';
import PhoneCall from 'react-native-phone-call';
import { Popup } from 'react-native-map-link';
import colors from '../../constants/Colors';
import styles from '../../styles/customer/Style_AboutPage';
import ViewMoreText from 'react-native-view-more-text';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import MapView from 'react-native-maps';
import { AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import database from '../../database';
import { clockRunning } from 'react-native-reanimated';

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopupVisble: false,
    };
    this.renderViewMore = this.renderViewMore.bind(this);
    this.renderViewLess = this.renderViewLess.bind(this);
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

  prettyAvailability(availability) {
    var prettyAvailability = ['Closed', 'Closed', 'Closed', 'Closed', 'Closed', 'Closed', 'Closed'];

    availability.map(item => {
      switch(item.dow) {
        case 'Sunday':
          prettyAvailability[0] = `${item.starttime.substring(0, 5)} - ${item.endtime.substring(0, 5)}`;
          break;

        case "Monday":
          prettyAvailability[1] = `${item.starttime.substring(0, 5)} - ${item.endtime.substring(0, 5)}`;
          break;

        case 'Tuesday':
          prettyAvailability[2] = `${item.starttime.substring(0, 5)} - ${item.endtime.substring(0, 5)}`;
          break;

        case 'Wednesday':
          prettyAvailability[3] = `${item.starttime.substring(0, 5)} - ${item.endtime.substring(0, 5)}`;
          break;

        case 'Thursday':
          prettyAvailability[4] = `${item.starttime.substring(0, 5)} - ${item.endtime.substring(0, 5)}`;
          break;

        case 'Friday':
          prettyAvailability[5] = `${item.starttime.substring(0, 5)} - ${item.endtime.substring(0, 5)}`;
          break;

        case 'Saturday':
          prettyAvailability[6] = `${item.starttime.substring(0, 5)} - ${item.endtime.substring(0, 5)}`;
          break;
      }
    });

    return prettyAvailability;
  }

  renderOpeningHours() {
    const businessData = this.props.businessData.businessDetails;
    const prettyAvailability = this.prettyAvailability(businessData.availability);

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
              <Text style={styles.hoursText}>{prettyAvailability[0]}</Text>
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Monday</Text>
              <Text style={styles.hoursText}>{prettyAvailability[1]}</Text>
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Tuesday</Text>
              <Text style={styles.hoursText}>{prettyAvailability[2]}</Text>
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Wednesday</Text>
              <Text style={styles.hoursText}>{prettyAvailability[3]}</Text>
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Thursday</Text>
              <Text style={styles.hoursText}>{prettyAvailability[4]}</Text>
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Friday</Text>
              <Text style={styles.hoursText}>{prettyAvailability[5]}</Text>
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Saturday</Text>
              <Text style={styles.hoursText}>{prettyAvailability[6]}</Text>
            </View>
          </CollapseBody>
        </Collapse>
      </View>
    )
  }

  render() {
    const businessData = this.props.businessData.businessDetails;

    return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.heading}>{businessData.business.name}</Text>
          {/* <Text style={styles.category}>{businessData.business.category}</Text> */}
          <View style={{ flexDirection: 'row' }}>
            <Rating
              style={styles.rating}
              imageSize={22}
              readonly={true}
              startingValue={businessData.business.rating === null ? 0 : Number(businessData.business.rating)}
              ratingColor={'#FED56B'}
              type={'custom'}
            />
            <Text style={{ color: 'grey', fontSize: 12, marginLeft: 4, marginTop: 3 }}>({businessData.business.ratingcount})</Text>
          </View>
          <View style={[{ flexDirection: 'row' }, styles.managerWordContainer]}>
            <Avatar
              containerStyle={styles.managerAvatar}
              rounded
              size={50}
              source={{ uri: businessData.business.avatar }}
            />
            <View style={styles.managerTextContainer}>
              <ViewMoreText
                numberOfLines={3}
                renderViewMore={this.renderViewMore}
                renderViewLess={this.renderViewLess}
              >
                <Text adjustsFontSizeToFit style={styles.managerText}>
                  {businessData.business.description}
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
                number: businessData.business.phone,
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
              Linking.openURL(businessData.business.website)
            }}
          >
            <View style={styles.iconsCircle}>
              <FontAwesome name="globe" size={24} color={colors.blue} style={{ marginLeft: 2 }} />
            </View>
            <Text style={styles.iconsText}>Website</Text>
          </TouchableOpacity>
          {this.renderOpeningHours()}
          {/* <View style={[styles.rowItems, styles.leftAlign, styles.infoRowsContainer]}>
            <View style={styles.iconsCircle}>
              <FontAwesome name="tags" size={23} color={colors.blue} style={{ marginLeft: 3 }} />
            </View>
            <Text style={styles.iconsText}>
              { businessData.tags[0].tag +
                ', ' +
                businessData.tags[1].tag +
                ', ' +
                businessData.tags[2].tag}
            </Text>
          </View> */}
          <TouchableOpacity
            style={[styles.rowItems, styles.leftAlign, styles.infoRowsContainer]}
            onPress={() => this.setState({ isPopupVisble: true })}
          >
            <View style={styles.iconsCircle}>
              <FontAwesome
                name="map-marker"
                size={24}
                color={colors.blue}
                style={{ marginLeft: 1 }}
              />
            </View>
            <Text style={styles.iconsText}>{businessData.business.street}, {businessData.business.city}.</Text>
          </TouchableOpacity>
          <Popup
            isVisible={this.state.isPopupVisble}
            onCancelPressed={() => this.setState({ isPopupVisble: false })}
            onAppPressed={() => this.setState({ isPopupVisble: false })}
            onBackButtonPressed={() => this.setState({ isPopupVisble: false })}
            modalProps={{ animationIn: 'slideInUp' }}
            appsWhiteList={[]}
            options={{
              alwaysIncludeGoogle: true,
              latitude: businessData.business.coordinates.x,
              longitude: businessData.business.coordinates.y,
              title: this.props.businessData.Name,
              dialogTitle: `${businessData.business.street}, ${businessData.business.city}`,
              cancelText: 'Cancel'
            }}
          />
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={{
                latitude: businessData.business.coordinates.x,
                latitudeDelta: 0.002,
                longitude: businessData.business.coordinates.y,
                longitudeDelta: 0.002
              }}
              provider={'google'}
              zoomTapEnabled={false}
            >
              <MapView.Marker
                coordinate={{
                  latitude: businessData.business.coordinates.x,
                  longitude: businessData.business.coordinates.y,
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
