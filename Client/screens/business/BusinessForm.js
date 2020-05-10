import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { Avatar, Rating, Divider, Button, Overlay, Input } from 'react-native-elements';
import colors from '../../constants/Colors';
import styles from '../../styles/business/Style_BusinessForm';
import Layout from '../../constants/Layout';
import ImagesSwiper from 'react-native-image-swiper';
import database from '../../database';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome, FontAwesome5, Ionicons, Octicons } from '@expo/vector-icons';
import ViewMoreText from 'react-native-view-more-text';
import RNPickerSelect from 'react-native-picker-select';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import TimePicker from "react-native-24h-timepicker";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import GradientButton from 'react-native-gradient-buttons';
// import MultiSelect from 'react-native-multiple-select';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { connect } from "react-redux";

const items = [
  { label: 'Football', value: 'football' },
  { label: 'Baseball', value: 'baseball' },
  { label: 'Hockey', value: 'hockey' },
  { label: 'Soccer', value: 'soccer' },
  { label: 'Vollyball', value: 'vollyball' },
]

class BusinessForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
       managerID: 1,
       name: 'Business Name',
       nameIsEditing: false,
       description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
       descriptionIsEditing: false,
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
       categoriesList: [],
       category: 'Category',
       categoryIsEditing: false,
       tagsList: [],
       tags: [],
       avatar: 'https://www.lococrossfit.com/wp-content/uploads/2019/02/user-icon-300x300.png',
       avatarEdited: false,
       carousel: ['https://www.interpeace.org/wp-content/themes/geneva/img/image-placeholder.png'],
       carouselEdited: false,
       isServicFormVisible: false,
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
       currentBusinessID: null,
       currentBusiness: {},
       isEditingBusiness: false,
       serviceName: 'Service Name',
       price: 111,
       durationMinutes: 9,
       qouta: 1,
       ServicesList: [],
       currentService: {},
       isEditingService: false
    };

    this.renderViewMore = this.renderViewMore.bind(this);
    this.renderViewLess = this.renderViewLess.bind(this);
    this.renderOpeningHours = this.renderOpeningHours.bind(this);
    this.renderOutlineButon = this.renderOutlineButon.bind(this);
    this.renderSolidButon = this.renderSolidButon.bind(this);
    this.handleCloseButton = this.handleCloseButton.bind(this);
    this.createOrUpdateBusiness = this.createOrUpdateBusiness.bind(this);
    this.fetchCategories = this.fetchCategories.bind(this);
    this.renderAbout = this.renderAbout.bind(this);
    this.renderServices = this.renderServices.bind(this);
    this.renderPricingCard = this.renderPricingCard.bind(this);
    this.createOrUpdateService = this.createOrUpdateService.bind(this);
    this.renderFormOverlay = this.renderFormOverlay.bind(this);
    this.fetchBusiness = this.fetchBusiness.bind(this);
  }

  componentDidMount() {
    this.getPermissionAsync();
    this.fetchCategories();
    if (this.state.isEditingBusiness) {
      this.fetchBusiness();
    }
    this.fetchBusinessServicesList();
    this.props.navigation.setOptions({
      headerRight: () => (
        <Octicons 
          name="check" 
          size={35} 
          color={colors.green03} 
          style={{marginRight: 15}} 
          // onPress={() => this.fetchBusinessServicesList()}
        />
      )
    });
  }

  async fetchCategories() {
    const url = `http://192.168.1.198:3000/business/getCategoriesList`;
    const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(async data => {
        let splits = data.categories.slice(1, data.categories.length - 1).split(',');
        let categoriesArr = splits.map((item) => {
          return { label: item, value: item }
        });
        this.setState({ categoriesList: categoriesArr });
      })
      .catch(error => console.log(error))
  }

  async fetchBusiness() {
    const url = `http://192.168.1.198:3000/business/getBusinessByID`;
    const options = { 
      method: 'POST', 
      headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
      },
      body: JSON.stringify({businessID: this.state.currentBusinessID})
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(async data => {
        console.log(data);
        this.setState({ 
          currentBusiness: data,
          name: data.name,
          description: data.description,
          phone: data.phone,
          website: data.website,
          addressID: data.address,
          street: 'bring address',
          city: 'bring address',
          country: 'bring address',
          category: data.category,
          // tags: [],
          avatar: data.avatar,
          // carousel: database.businesses[0].Pictures.Carousel,
        });
      })
      .catch(error => console.log(error))
  }

  async fetchBusinessServicesList() {
    const url = `http://192.168.1.198:3000/service/getAllBusinessServices`;
    const options = { 
      method: 'POST', 
      headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
      },
      body: JSON.stringify({businessID: this.state.currentBusinessID})
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(async data => {
        // console.log(data)
        this.setState({ServicesList: data});
      })
      .catch(error => console.log(error))
  }

  async deleteService() {
    const url = `http://192.168.1.198:3000/service/deleteService`;
    const options = { 
      method: 'POST', 
      headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
      },
      body: JSON.stringify({serviceID: this.state.currentService.serviceid})
    };
    const request = new Request(url, options)

    await fetch(request)
      .then(response => response.json())
      .then(async data => {
        console.log(data)
        this.fetchBusinessServicesList();
      })
      .catch(error => console.log(error))

    this.setState({ isServicFormVisible: false, isEditingService: false });
  }

  async createOrUpdateBusiness() {
    let formData = new FormData();

    const business = {
      managerID: this.state.managerID,
      name: this.state.name,
      category: this.state.category,
      tags: this.state.tags,
      street: this.state.street,
      city: this.state.city,
      country: this.state.country,
      phone: this.state.phone,
      website: this.state.website,
      description: this.state.description,
      availability: this.state.availability
    };
    
    const avatar = {
      name: 'avatar',
      type: 'image/jpeg', 
      uri: Platform.OS === 'android' ? this.state.avatar : this.state.avatar.replace('file://', '')
    };

    formData.append('business', JSON.stringify(business));
    formData.append('avatar', avatar);

    this.state.carousel.map((item, index) => {
      let image = {
        name: `image${index + 1}`,
        type: 'image/jpeg', 
        uri: Platform.OS === 'android' ? item : item.replace('file://', '')
      };
      formData.append('carousel', image);
    })
  
    const url = 'http://192.168.1.198:3000/business/createNewBusiness';
    const options = { method: 'POST', body: formData };
    const request = new Request(url, options);

    await fetch(request)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => console.log(data))
      .catch(error => console.log(error))
  }

  async createOrUpdateService() {
    const service = {
      BusinessID: this.state.currentBusinessID,
      serviceID: this.state.currentService.serviceid,
      name: this.state.serviceName,
      price: this.state.price,
      durationMinutes: this.state.durationMinutes,
      qouta: this.state.qouta,
    };

    let action = this.state.isEditingService ? 'updateServiceDetails' : 'createNewService';

    const url = `http://192.168.1.198:3000/service/${action}`;
    const options = { 
      method: 'POST', 
      headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
      },
      body: JSON.stringify(service)
    };
    const request = new Request(url, options);

    await fetch(request)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => {
        console.log(data);
        this.fetchBusinessServicesList();
      })
      .catch(error => console.log(error))

    this.setState({ isServicFormVisible: false, isEditingService: false });
  }

  onSelectedItemsChange = (tags) => {
    this.setState({ tags: tags });
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
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        // console.log(result);
        if(type === 'carousel') {
          if(this.state.carouselEdited) {
            this.setState({ carousel: [...this.state.carousel, result.uri] });
          } 
          else {
            this.setState({ 
              carousel: [result.uri],
              carouselEdited: true
            });
          }
        }
        else if(type === 'avatar') {
          this.setState({ avatar: result.uri });
        }
      }
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

  renderAbout() {
    const businessData = database.businesses[0];
    let { avatar } = this.state

    return(
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={100} behavior={"position"}>
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
            onPress={() => this._pickImage('avatar')}
          />
          { this.state.descriptionIsEditing ?
            <TextInput
              value={this.state.description}
              style={{ ...styles.managerText, borderWidth: 1, borderColor: colors.gray04, marginHorizontal: 10, marginTop: 5, marginLeft: -5 }}
              onChangeText={(value) => this.setState({ description: value })}
              onBlur={() => this.setState({ descriptionIsEditing: false })}
              autoFocus
              multiline
            /> 
            :
            <TouchableOpacity style={styles.managerTextContainer} onPress={() => this.setState({descriptionIsEditing: true})}>
              <View style={styles.managerTextContainer}>
                <ViewMoreText
                  numberOfLines={3}
                  renderViewMore={this.renderViewMore}
                  renderViewLess={this.renderViewLess}
                >
                  <Text adjustsFontSizeToFit style={styles.managerText}>{this.state.description}</Text>
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
            <FontAwesome5 name="tags" size={18} color={colors.blue} style={{ marginLeft: 1 }} />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RNPickerSelect
              onValueChange={(value) => this.setState({ category: value })}
              placeholder={{label: 'Select a category...', value: null}}
              textInputProps={styles.iconsText}
              items={this.state.categoriesList}
              value={this.state.category}
            />
          </View>
          <MaterialCommunityIcons name="circle-edit-outline" size={20} color={colors.gray03} style={{ marginLeft: 10, }}/>
        </View>

        <View style={[styles.rowItems, styles.leftAlign, styles.infoRowsContainer]}>
          <View style={styles.iconsCircle}>
            <FontAwesome name="hashtag" size={20} color={colors.blue} style={{ marginLeft: 1 }} />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RNPickerSelect
              onValueChange={(value) => this.setState({ tags: [...this.state.tags, value] })}
              placeholder={{label: 'Select...', value: null}}
              textInputProps={styles.iconsText}
              items={items}
              // value={this.state.tags[0]}
            />
            <Text>,</Text>
            <RNPickerSelect
              onValueChange={(value) => this.setState({ tags: [...this.state.tags, value] })}
              placeholder={{label: 'Select...', value: null}}
              textInputProps={styles.iconsText}
              items={items}
              // value={this.state.tags[1]}
            />
            <Text>,</Text>
            <RNPickerSelect
              onValueChange={(value) => this.setState({ tags: [...this.state.tags, value] })}
              placeholder={{label: 'Select...', value: null}}
              textInputProps={styles.iconsText}
              items={items}
              // value={this.state.tags[2]}
            />
          </View>
          <MaterialCommunityIcons name="circle-edit-outline" size={20} color={colors.gray03} style={{ marginLeft: 10, marginRight: 10}}/>
        </View>

        {this.renderOpeningHours(businessData)}
      </KeyboardAvoidingView>
      </ScrollView>
    )
  }

  renderFormOverlay() {
    // console.log(this.state.currentService)
    return (
      <Overlay 
        isVisible={this.state.isServicFormVisible} 
        onBackdropPress={() => this.setState({ isServicFormVisible: false, isEditingService: false })}
      >
        <View style={{flex: 1}}>
          <Text style={{fontSize: 24, fontWeight: '600', marginBottom: 30, marginTop: 20, alignSelf: 'center'}}>Service Details</Text>
          <Input
            label='Service Name'
            placeholder='Enter Name'
            containerStyle={{marginTop: 20, width: '90%', alignSelf: 'center'}}
            onChangeText={text => this.setState({serviceName: text})}
            value={this.state.serviceName}
          />
          <Input
            label='Price'
            placeholder='Enter Price'
            containerStyle={{marginTop: 20, width: '90%', alignSelf: 'center'}}
            onChangeText={text => this.setState({price: text})}
            keyboardType='numeric'
            value={this.state.price.toString()}
          />
          <Input
            label='Duration'
            placeholder='Enter Duration'
            containerStyle={{marginTop: 20, width: '90%', alignSelf: 'center'}}
            onChangeText={text => this.setState({durationMinutes: text})}
            keyboardType='numeric'
            value={this.state.durationMinutes.toString()}
          />
          <Input
            label='Qouta'
            placeholder='Enter Qouta'
            containerStyle={{marginTop: 20, width: '90%', alignSelf: 'center'}}
            onChangeText={text => this.setState({qouta: text})}
            keyboardType='numeric'
            value={this.state.qouta.toString()}
          />
          <View style={{alignSelf: 'center', alignItems: 'center', width: '100%', position: 'absolute', bottom: 20}}>
            <Button
              title={this.state.isEditingService ? 'Update Service' : 'Create Service'}
              containerStyle={{width: '70%', }}
              buttonStyle={{}}
              onPress={() => this.createOrUpdateService()}
            />
            {
              this.state.isEditingService === false ? null :
              <Button
                title="Delete Service"
                titleStyle={{color: 'red'}}
                type="outline"
                containerStyle={{width: '70%', marginTop: 20}}
                buttonStyle={{borderColor: 'red'}}
                onPress={() => this.deleteService()}
              />
            }
          </View>
        </View>
      </Overlay>
    )
  }

  renderServices() {
    return(
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center', marginTop: 35 }}>
          <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={this.state.ServicesList}
              renderItem={this.renderPricingCard}
          />
          </View>

          <Button
            // icon={<Ionicons name="ios-add-circle-outline" size={35} color="white"/>}
            // iconRight
            title="Add new service"
            containerStyle={{alignSelf: 'center', width: '60%', marginBottom: 20}}
            buttonStyle={{}}
            onPress={() => {
              this.setState({ 
                isServicFormVisible: true,
                serviceName: '',
                price: '',
                durationMinutes: '',
                qouta: '',
              })
            }}
          />

          {this.renderFormOverlay()}
      </ScrollView>
    )
  }

  renderPricingCard({ item }) {
    return (
      <View style={styles.pricingCardContainer}>
        <View>
          <Text style={styles.titleText}>{item.name}</Text>
        </View>
        <View>
          <Text style={styles.priceText}>{item.price}$</Text>
        </View>
        <View>
          <Text style={styles.durationText}>Duration: {item.durationminutes}</Text>
        </View>
        <View style={styles.bookButtonContainer}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => {
              this.setState({ 
                currentService: item,
                isServicFormVisible: true,
                isEditingService: true,
                serviceName: item.name,
                price: item.price,
                durationMinutes: item.durationminutes,
                qouta: item.qouta,
              });
            }}
          >
            <Text style={styles.bookButtonTitle}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
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

        <ScrollableTabView
          initialPage={0}
          locked={true}
          tabBarUnderlineStyle={styles.tabBarUnderline}
          tabBarBackgroundColor={'#FEFDFF'}
          tabBarActiveTextColor={colors.red}
          tabBarInactiveTextColor={'grey'}
          tabBarTextStyle={styles.tabBarText}
        >
          <View tabLabel='About'>
            {this.renderAbout()}
          </View>
          <View tabLabel='Services'>
            {this.renderServices()}
          </View>
        </ScrollableTabView>

      </View>
    );
  }
}

const mapStateToProps = ({  }) => {
  return {
  }
}

export default connect(mapStateToProps)(BusinessForm)

// export default BusinessForm;
