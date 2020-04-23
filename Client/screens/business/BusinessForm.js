import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import { Avatar, Rating, Divider, Button } from 'react-native-elements';
import colors from '../../constants/Colors';
import styles from '../../styles/business/Style_BusinessForm';
import Layout from '../../constants/Layout';
import ImagesSwiper from 'react-native-image-swiper';
import database from '../../database';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import ViewMoreText from 'react-native-view-more-text';
import RNPickerSelect from 'react-native-picker-select';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import TimePicker from "react-native-24h-timepicker";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
// import { Input, CheckBox } from 'react-native-elements';

class BusinessForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
       managerID: null,
       name: 'Business Name',
       nameIsEditing: false,
       descriptionion: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
       descriptionionIsEditing: false,
       phone: '03-9011111',
       phoneIsEditing: false,
       website: 'www.example.com',
       websiteIsEditing: false,
       addressID: null,
       street: 'Street',
       streetIsEditing: false,
       city: 'City',
       cityIsEditing: false,
       country: 'Country',
       countryIsEditing: false,
       category: 'Category',
       categoryIsEditing: false,
       tag: 'Tag',
       avatar: database.businesses[0].Pictures.Avatar,
       carousel: database.businesses[0].Pictures.Carousel,
       availability: {
         sunday: {
          isOpen: true,
          open: '0:00',
          closes: '0:00'
         },
         monday: {
          isOpen: true,
          open: '0:00',
          closes: '0:00'
         },
         tuesday: {
          isOpen: true,
          open: '0:00',
          closes: '0:00'
         },
         wednesday: {
          isOpen: true,
          open: '0:00',
          closes: '0:00'
         },
         thursday: {
          isOpen: true,
          open: '0:00',
          closes: '0:00'
         },
         friday: {
          isOpen: true,
          open: '0:00',
          closes: '0:00'
         },
         saturday: {
          isOpen: true,
          open: '0:00',
          closes: '0:00'
         },
       },
    };

    this.renderViewMore = this.renderViewMore.bind(this);
    this.renderViewLess = this.renderViewLess.bind(this);
    this.renderOpeningHours = this.renderOpeningHours.bind(this);
    this.renderOutlineButon = this.renderOutlineButon.bind(this);
    this.renderSolidButon = this.renderSolidButon.bind(this);
    this.handleCloseButton = this.handleCloseButton.bind(this);
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async (type) => {
    // console.log(type);///////
    let test = type
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(test);///////
      if (!result.cancelled) {
        if(test === 'carousel') {
          console.log(test);///////
        }
        else if(test === 'avatar') {
          console.log(test);///////
        }
        // this.setState({ avatar: result.uri });
      }
      // console.log(result);
    } catch (e) {
      console.log(e);
    }
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

  renderOutlineButon(day) {
    return (
      <Button 
        title="Close" 
        titleStyle={{fontSize: 10, color: "red",}}
        type="solid" 
        containerStyle={{alignContent: 'center', position: 'absolute', right: 0, marginRight: 15, }}
        buttonStyle={{alignContent: 'center', backgroundColor: "white", width: 50, height: 28, borderWidth: 1, borderColor: "red", padding: 0}}
        onPress={() => this.handleCloseButton(day)}
      />
    )
  }

  renderSolidButon(day) {
    return (
      <Button 
        title="Closed" 
        titleStyle={{fontSize: 10, color: "white",}}
        type="solid" 
        containerStyle={{alignContent: 'center', position: 'absolute', right: 0, marginRight: 15, }}
        buttonStyle={{alignContent: 'center', backgroundColor: "red", width: 50, height: 28, padding: 0}}
        onPress={() => this.handleCloseButton(day)}
      />
    )
  }

  handleCloseButton(day) {
    this.setState({
      availability: {
        ...this.state.availability,
        [day]: {
          ...this.state.availability[day],
          isOpen: !this.state.availability[day].isOpen
        }
      }
    });
  }

  onCancel() {
    this.TimePicker.close();
  }
 
  onConfirm(hour, minute, day, open, closes) {
    this.setState({
      availability: {
        ...this.state.availability,
        [day]: {
          ...this.state.availability[day],
          open: open === true ? `${hour}:${minute}` : this.state.availability[day].open,
          closes: closes === true ? `${hour}:${minute}` : this.state.availability[day].closes,
        }
      }
    });

    this.TimePicker.close();
  }

  renderOpeningHours(businessData) {
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
          <CollapseBody style={{}}>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Sunday</Text>
              <Text 
                style={{...styles.hoursText, borderWidth: 0.6, borderRadius: 2, borderColor: colors.lightBlack, marginLeft: 41, backgroundColor: this.state.availability.sunday.isOpen ? colors.white : colors.gray02}} 
                onPress={() => {
                  day = 'sunday';
                  open = true; 
                  closes = false;
                  this.TimePicker.open();
                }}
              >
                {this.state.availability.sunday.open}
              </Text>
              <Text style={{...styles.hoursText}} > - </Text>
              <Text 
                style={{...styles.hoursText, borderWidth: 0.6, borderRadius: 2, borderColor: colors.lightBlack, backgroundColor: this.state.availability.sunday.isOpen ? colors.white : colors.gray02}} 
                onPress={() => {
                  day = 'sunday';
                  open = false; 
                  closes = true;
                  this.TimePicker.open();
                }}
              >
                {this.state.availability.sunday.closes}
              </Text>
              {this.state.availability.sunday.isOpen ? this.renderOutlineButon('sunday') : this.renderSolidButon('sunday')}
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Monday</Text>
              <Text 
                style={{...styles.hoursText, borderWidth: 0.6, borderRadius: 2, borderColor: colors.lightBlack, marginLeft: 37, backgroundColor: this.state.availability.monday.isOpen ? colors.white : colors.gray02}} 
                onPress={() => {
                  day = 'monday';
                  open = true; 
                  closes = false;
                  this.TimePicker.open();
                }}
              >
                {this.state.availability.monday.open}
              </Text>
              <Text style={{...styles.hoursText}} > - </Text>
              <Text 
                style={{...styles.hoursText, borderWidth: 0.6, borderRadius: 2, borderColor: colors.lightBlack, backgroundColor: this.state.availability.monday.isOpen ? colors.white : colors.gray02}} 
                onPress={() => {
                  day = 'monday';
                  open = false; 
                  closes = true;
                  this.TimePicker.open();
                }}
              >
                {this.state.availability.monday.closes}
              </Text>
              {this.state.availability.monday.isOpen ? this.renderOutlineButon('monday') : this.renderSolidButon('monday')}
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Tuesday</Text>
              <Text 
                style={{...styles.hoursText, borderWidth: 0.6, borderRadius: 2, borderColor: colors.lightBlack, marginLeft: 34, backgroundColor: this.state.availability.tuesday.isOpen ? colors.white : colors.gray02}} 
                onPress={() => {
                  day = 'tuesday';
                  open = true; 
                  closes = false;
                  this.TimePicker.open();
                }}
              >
                {this.state.availability.tuesday.open}
              </Text>
              <Text style={{...styles.hoursText}} > - </Text>
              <Text 
                style={{...styles.hoursText, borderWidth: 0.6, borderRadius: 2, borderColor: colors.lightBlack, backgroundColor: this.state.availability.tuesday.isOpen ? colors.white : colors.gray02}} 
                onPress={() => {
                  day = 'tuesday';
                  open = false; 
                  closes = true;
                  this.TimePicker.open();
                }}
              >
                {this.state.availability.tuesday.closes}
              </Text>
              {this.state.availability.tuesday.isOpen ? this.renderOutlineButon('tuesday') : this.renderSolidButon('tuesday')}
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Wednesday</Text>
              <Text 
                style={{...styles.hoursText, borderWidth: 0.6, borderRadius: 2, borderColor: colors.lightBlack, marginLeft: 10, backgroundColor: this.state.availability.wednesday.isOpen ? colors.white : colors.gray02}} 
                onPress={() => {
                  day = 'wednesday';
                  open = true; 
                  closes = false;
                  this.TimePicker.open();
                }}
              >
                {this.state.availability.wednesday.open}
              </Text>
              <Text style={{...styles.hoursText}} > - </Text>
              <Text 
                style={{...styles.hoursText, borderWidth: 0.6, borderRadius: 2, borderColor: colors.lightBlack, backgroundColor: this.state.availability.wednesday.isOpen ? colors.white : colors.gray02}} 
                onPress={() => {
                  day = 'wednesday';
                  open = false; 
                  closes = true;
                  this.TimePicker.open();
                }}
              >
                {this.state.availability.wednesday.closes}
              </Text>
              {this.state.availability.wednesday.isOpen ? this.renderOutlineButon('wednesday') : this.renderSolidButon('wednesday')}
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Thursday</Text>
              <Text 
                style={{...styles.hoursText, borderWidth: 0.6, borderRadius: 2, borderColor: colors.lightBlack, marginLeft: 27, backgroundColor: this.state.availability.thursday.isOpen ? colors.white : colors.gray02}} 
                onPress={() => {
                  day = 'thursday';
                  open = true; 
                  closes = false;
                  this.TimePicker.open();
                }}
              >
                {this.state.availability.thursday.open}
              </Text>
              <Text style={{...styles.hoursText}} > - </Text>
              <Text 
                style={{...styles.hoursText, borderWidth: 0.6, borderRadius: 2, borderColor: colors.lightBlack, backgroundColor: this.state.availability.thursday.isOpen ? colors.white : colors.gray02}} 
                onPress={() => {
                  day = 'thursday';
                  open = false; 
                  closes = true;
                  this.TimePicker.open();
                }}
              >
                {this.state.availability.thursday.closes}
              </Text>
              {this.state.availability.thursday.isOpen ? this.renderOutlineButon('thursday') : this.renderSolidButon('thursday')}
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Friday</Text>
              <Text 
                style={{...styles.hoursText, borderWidth: 0.6, borderRadius: 2, borderColor: colors.lightBlack, marginLeft: 50, backgroundColor: this.state.availability.friday.isOpen ? colors.white : colors.gray02}} 
                onPress={() => {
                  day = 'friday';
                  open = true; 
                  closes = false;
                  this.TimePicker.open();
                }}
              >
                {this.state.availability.friday.open}
              </Text>
              <Text style={{...styles.hoursText}} > - </Text>
              <Text 
                style={{...styles.hoursText, borderWidth: 0.6, borderRadius: 2, borderColor: colors.lightBlack, backgroundColor: this.state.availability.friday.isOpen ? colors.white : colors.gray02}} 
                onPress={() => {
                  day = 'friday';
                  open = false; 
                  closes = true;
                  this.TimePicker.open();
                }}
              >
                {this.state.availability.friday.closes}
              </Text>
              {this.state.availability.friday.isOpen ? this.renderOutlineButon('friday') : this.renderSolidButon('friday')}
            </View>
            <View style={[styles.rowItems, styles.hoursTextContainer]}>
              <Text style={styles.daysText}>Saturday</Text>
              <Text 
                style={{...styles.hoursText, borderWidth: 0.6, borderRadius: 2, borderColor: colors.lightBlack, marginLeft: 30, backgroundColor: this.state.availability.saturday.isOpen ? colors.white : colors.gray02}} 
                onPress={() => {
                  day = 'saturday';
                  open = true; 
                  closes = false;
                  this.TimePicker.open();
                }}
              >
                {this.state.availability.saturday.open}
              </Text>
              <Text style={{...styles.hoursText}} > - </Text>
              <Text 
                style={{...styles.hoursText, borderWidth: 0.6, borderRadius: 2, borderColor: colors.lightBlack, backgroundColor: this.state.availability.saturday.isOpen ? colors.white : colors.gray02}} 
                onPress={() => {
                  day = 'saturday';
                  open = false; 
                  closes = true;
                  this.TimePicker.open();
                }}
              >
                {this.state.availability.saturday.closes}
              </Text>
              {this.state.availability.saturday.isOpen ? this.renderOutlineButon('saturday') : this.renderSolidButon('saturday')}
            </View>
          </CollapseBody>
        <MaterialCommunityIcons name="circle-edit-outline" size={20} color={colors.gray03} style={{ marginLeft: 10, }}/>
        </Collapse>
        <TimePicker
          ref={ref => {this.TimePicker = ref;}}
          onCancel={() => this.onCancel()}
          onConfirm={(hour, minute) => this.onConfirm(hour, minute, day, open, closes)}
          minuteInterval={30}
        />
      </View>
    )
  }

  render() {
    const businessData = database.businesses[0];
    let { avatar } = this.state

    return (
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
        <View style={{flex: 1}}>
          
          <View style={{...styles.ImagesSwiperContainer, alignItems: 'flex-end'}}>
            <ImagesSwiper
              images={this.state.carousel}
              autoplay={true}
              autoplayTimeout={5}
              showsPagination
              width={Layout.window.width}
              height={200}
            />
            <TouchableOpacity onPress={() => this._pickImage('carousel')} style={{position: 'absolute'}}>
              <MaterialIcons name="add-to-photos" size={25} color={"white"} style={{margin: 12}} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

            <View>
              { this.state.nameIsEditing ?
                <TextInput
                  value={this.state.name}
                  style={{ ...styles.heading, borderWidth: 1, borderColor: colors.gray04, marginHorizontal: 10, }}
                  onChangeText={(value) => this.setState({ name: value })}
                  onBlur={() => this.setState({ nameIsEditing: false })}
                  autoFocus
                /> 
                :
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.heading} onPress={() => this.setState({ nameIsEditing: true })}>
                    {this.state.name}
                  </Text>
                  <MaterialCommunityIcons 
                    name="circle-edit-outline" 
                    size={20} color={colors.gray03} 
                    style={{ marginTop: 10, marginLeft: 5}} 
                  />
                </View>
              }
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <Rating
                style={styles.rating}
                imageSize={22}
                readonly={true}
                startingValue={0}
                ratingColor={'#FED56B'}
                type={'custom'}
              />
              <Text style={{ color: 'grey', fontSize: 12, marginLeft: 4, marginTop: 3 }}>(0)</Text>
            </View>

            <View style={[{ flexDirection: 'row' }, styles.managerWordContainer]}>
              <Avatar
                containerStyle={styles.managerAvatar}
                rounded
                size={50}
                source={{ uri: avatar }}
                showEditButton
                editButton={{type: 'MaterialIcons', name: 'add-a-photo', }}
                onPress={this._pickImage}
              />
              { this.state.descriptionionIsEditing ?
                <TextInput
                  value={this.state.descriptionion}
                  style={{ ...styles.managerText, borderWidth: 1, borderColor: colors.gray04, marginHorizontal: 10, marginTop: 5, marginLeft: -5 }}
                  onChangeText={(value) => this.setState({ descriptionion: value })}
                  onBlur={() => this.setState({ descriptionionIsEditing: false })}
                  autoFocus
                  multiline
                /> 
                :
                <TouchableOpacity style={styles.managerTextContainer} onPress={() => this.setState({descriptionionIsEditing: true})}>
                  <View style={styles.managerTextContainer}>
                    <ViewMoreText
                      numberOfLines={3}
                      renderViewMore={this.renderViewMore}
                      renderViewLess={this.renderViewLess}
                    >
                      <Text adjustsFontSizeToFit style={styles.managerText}>{this.state.descriptionion}</Text>
                    </ViewMoreText>
                  </View>
                  <MaterialCommunityIcons name="circle-edit-outline" size={20} color={colors.gray03} style={{ marginLeft: 5, }}/>
                </TouchableOpacity>
              }
            </View>

            <View style={styles.dividerContainer}>
              <Divider style={styles.divider}/>
            </View>

            <TouchableOpacity 
            style={[styles.rowItems, styles.leftAlign, styles.infoRowsContainer]}
            onPress={() => this.setState({phoneIsEditing: true})}
            >
              <View style={styles.iconsCircle}>
                <FontAwesome name="phone" size={24} color={colors.blue} style={{ marginLeft: 1 }} />
              </View>
              { this.state.phoneIsEditing ?
                <TextInput
                  value={this.state.phone}
                  style={{ ...styles.iconsText, borderWidth: 1, borderColor: colors.gray04, marginHorizontal: 10, }}
                  onChangeText={(value) => this.setState({ phone: value })}
                  onBlur={() => this.setState({ phoneIsEditing: false })}
                  autoFocus
                  keyboardType='numeric'
                /> 
                :
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.iconsText}>{this.state.phone}</Text>
                  <MaterialCommunityIcons name="circle-edit-outline" size={20} color={colors.gray03} style={{ marginLeft: 10, }}/>
                </View>
              }
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.rowItems, styles.leftAlign, styles.infoRowsContainer]}
              onPress={() => this.setState({websiteIsEditing: true})}
            >
              <View style={styles.iconsCircle}>
                <FontAwesome name="globe" size={24} color={colors.blue} style={{ marginLeft: 1 }} />
              </View>
              { this.state.websiteIsEditing ?
                <TextInput
                  value={this.state.website}
                  style={{ ...styles.iconsText, borderWidth: 1, borderColor: colors.gray04, marginHorizontal: 10, }}
                  onChangeText={(value) => this.setState({ website: value })}
                  onBlur={() => this.setState({ websiteIsEditing: false })}
                  autoFocus
                /> 
                :
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.iconsText}>{this.state.website}</Text>
                  <MaterialCommunityIcons name="circle-edit-outline" size={20} color={colors.gray03} style={{ marginLeft: 10, }}/>
                </View>
              }
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.rowItems, styles.leftAlign, styles.infoRowsContainer]}
              onPress={() => this.setState({streetIsEditing: true})}
            >
              <View style={styles.iconsCircle}>
                <FontAwesome name="map-marker" size={24} color={colors.blue} style={{ marginLeft: 1 }} />
              </View>
              { this.state.streetIsEditing ?
                <View style={{flexDirection: 'column'}}>
                  <TextInput
                    value={this.state.street}
                    style={{ ...styles.iconsText, borderWidth: 1, borderColor: colors.gray04, marginHorizontal: 10, }}
                    onChangeText={(value) => this.setState({ street: value })}
                    onBlur={() => this.setState({ streetIsEditing: false })}
                    // autoFocus
                  /> 
                  <TextInput
                    value={this.state.city}
                    style={{ ...styles.iconsText, borderWidth: 1, borderColor: colors.gray04, marginHorizontal: 10, }}
                    onChangeText={(value) => this.setState({ city: value })}
                    onBlur={() => this.setState({ streetIsEditing: false })}
                  /> 
                  <TextInput
                    value={this.state.country}
                    style={{ ...styles.iconsText, borderWidth: 1, borderColor: colors.gray04, marginHorizontal: 10, }}
                    onChangeText={(value) => this.setState({ country: value })}
                    onBlur={() => this.setState({ streetIsEditing: false })}
                  /> 
                </View>
                :
                <View style={{flexDirection: 'row', alignItems: 'center', flexShrink: 1, overflow: 'hidden'}}>
                  <Text style={styles.iconsText}>{this.state.street}, {this.state.city}, {this.state.country}</Text>
                  <MaterialCommunityIcons name="circle-edit-outline" size={20} color={colors.gray03} style={{marginLeft: 10, marginRight: 5}}/>
                </View>
              }
            </TouchableOpacity>

            <View style={[styles.rowItems, styles.leftAlign, styles.infoRowsContainer]}>
              <View style={styles.iconsCircle}>
                <FontAwesome5 name="hashtag" size={24} color={colors.blue} style={{ marginLeft: 1 }} />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RNPickerSelect
                  onValueChange={(value) => this.setState({ category: value })}
                  textInputProps={styles.iconsText}
                  items={[
                      { label: 'Football', value: 'football' },
                      { label: 'Baseball', value: 'baseball' },
                      { label: 'Hockey', value: 'hockey' },
                  ]}
                />
              </View>
              <MaterialCommunityIcons name="circle-edit-outline" size={20} color={colors.gray03} style={{ marginLeft: 10, }}/>
            </View>

            <View style={[styles.rowItems, styles.leftAlign, styles.infoRowsContainer]}>
              <View style={styles.iconsCircle}>
                <FontAwesome name="tags" size={24} color={colors.blue} style={{ marginLeft: 1 }} />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RNPickerSelect
                  onValueChange={(value) => this.setState({ tag: value })}
                  textInputProps={styles.iconsText}
                  items={[
                      { label: 'Football', value: 'football' },
                      { label: 'Baseball', value: 'baseball' },
                      { label: 'Hockey', value: 'hockey' },
                  ]}
                />
              </View>
              <MaterialCommunityIcons name="circle-edit-outline" size={20} color={colors.gray03} style={{ marginLeft: 10, }}/>
            </View>

            {this.renderOpeningHours(businessData)}

          </ScrollView>

        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default BusinessForm;
