import React, { Component } from 'react';
import { ActivityIndicator, Alert, View, Text, StyleSheet, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, DeviceEventEmitter, Dimensions, StatusBar, TouchableOpacity, Platform } from 'react-native';
import styles from '../styles/Style_LoginScreen';
import layout from '../constants/Layout'
import colors from '../constants/Colors'
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import Svg, { Image, Circle, ClipPath } from 'react-native-svg';
import Animated, { 
    Value, 
    event, 
    block, 
    cond, 
    eq, 
    set, 
    Clock, 
    startClock, 
    stopClock, 
    debug, 
    timing, 
    clockRunning, 
    Easing, 
    interpolate, 
    Extrapolate,
    concat
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';
import * as Actions_User from '../redux/actions/Actions_User';
import * as Actions_Customer from '../redux/actions/Actions_Customer';
import { connect } from 'react-redux';
// import firebaseApp from '../firebaseConfig';
require('../firebaseConfig');
import route from '../routeConfig';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        screenStatus: 'sign-in',
        // isReady: false,
        visibleHeight: layout.window.height,
        isKeyboardOpen: false,
        email: '',
        emailValidationColor: colors.gray02,
        password: '',
        passwordValidationColor: colors.gray02,
        hidePassword: true,
        logoSize: {width: 100, height: 70},
        signed: false,
        // shouldRender: false
    };

    this.buttonOpacity = new Value(1);

    this.onStateChange = event([
        {
            nativeEvent: ({state}) => block([cond(eq(state, State.END), set(this.buttonOpacity, runTiming(new Clock(), 1, 0)))])
        }
    ]);

    this.onCloseState = event([
        {
            nativeEvent: ({state}) => block([cond(eq(state, State.END), set(this.buttonOpacity, runTiming(new Clock(), 0, 1)))])
        }
    ]);

    this.buttonY = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [300, 0],
        extrapolate: Extrapolate.CLAMP
    });

    this.bgY = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: this.state.isKeyboardOpen === true ? [-layout.window.height / 3 - this.state.visibleHeight, 0] : [-layout.window.height / 3 - 50, 0],
        extrapolate: Extrapolate.CLAMP
    });

    this.textInputZIndex = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [1, -1],
        extrapolate: Extrapolate.CLAMP
    });

    this.textInputY = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [0, 300],
        extrapolate: Extrapolate.CLAMP
    });

    this.textInputOpacity = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [1, 0],
        extrapolate: Extrapolate.CLAMP
    });

    this.rotateCross = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [180, 360],
        extrapolate: Extrapolate.CLAMP
    });

    this.validateEmail = this.validateEmail.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.renderPasswordIcon = this.renderPasswordIcon.bind(this);
    this.renderSignIn = this.renderSignIn.bind(this);
    this.renderSignUp = this.renderSignUp.bind(this);
    this.createNewUser = this.createNewUser.bind(this);
    this.validateUser = this.validateUser.bind(this);
    this.logInViaFacebook = this.logInViaFacebook.bind(this);
    this.logInViaGoogle = this.logInViaGoogle.bind(this);
    this.isUserEqual = this.isUserEqual.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }

    componentDidMount() {

    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    keyboardDidShow(e) {
        let newSize = layout.window.height - e.endCoordinates.height
        this.setState({
            isKeyboardOpen: true,
            visibleHeight: newSize,
            logoSize: {width: 100, height: 70}
        })
    }
      
    keyboardDidHide(e) {
        this.setState({
            isKeyboardOpen: false,
            visibleHeight: layout.window.height,
            logoSize: {width: Dimensions.get('window').width}
        })
    } 

    validateEmail(email) {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return expression.test(String(email).toLowerCase());
    }

    handleEmailChange(text) {
        let validation = this.validateEmail(text);

        this.setState({ 
            email: text,
            emailValidationColor: validation === true ? 'green' : colors.gray02
        });
    }

    handlePasswordChange(text) {
        this.setState({ password: text });
    }

    handleHidePassword() {
        this.setState({ hidePassword: !this.state.hidePassword });
    }

    renderPasswordIcon() {
        if (this.state.password.length > 0) {
            return(
                <Animatable.View animation="flipInX">
                    <TouchableOpacity onPress={() => this.handleHidePassword()}>
                        {
                            this.state.hidePassword === true ?
                            <Feather name="eye-off" color={colors.gray02} size={20} style={styles.inputIconRight}/>
                            :
                            <Feather name="eye" color={colors.gray02} size={20} style={styles.inputIconRight}/>
                        }
                    </TouchableOpacity>
                </Animatable.View>
            );
        } else return null;
    }
    
    renderSignIn() {
        const { email, password } = this.state;

        return(
            <View>
                <TouchableOpacity style={styles.forgotPasswordContainer}>
                    <Text style={styles.textForgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.logInViaEmail(email, password)}>
                    <Animated.View style={{...styles.button}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>SIGN IN</Text>
                    </Animated.View>
                </TouchableOpacity>
            </View>
        );
    }

    renderSignUp() {
        const { email, password } = this.state;
        return(
            <TouchableOpacity onPress={() => this.signUpViaEmail(email, password)}>
                <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                    <Animated.View style={{...styles.button}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}} >SIGN UP</Text>
                    </Animated.View>
                </TapGestureHandler>
            </TouchableOpacity>
        );
    }

    validateUser() {
        if(this.state.password.length > 0 && this.validateEmail(this.state.email)) return true
        else return false
    }

    async createNewUser(user) {
        if(this.validateUser()) {
            const url = `${route}/register`;
            const options = { 
                method: 'POST', 
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(user)
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
                })
              .catch(error => console.log(error))
        } else {
            Alert.alert(
                'Try again',
                'Incorrect email or password',
                [
                    {text: 'OK'},
                ],
                { cancelable: false }
            )
        }
    }

    async loginUser(user) {
        if(this.validateUser()) {
            const url = `${route}/login`;
            const options = { 
                method: 'POST', 
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(user)
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
              .then(data => console.log(data.status))
              .catch(error => console.log(error))
        } else {
            Alert.alert(
                'Try again',
                'Incorrect email or password',
                [
                    {text: 'OK'},
                ],
                { cancelable: false }
            )
        }
    }

    signUpViaEmail = (email, password) => {
        try {
            if (password.length < 6) {
                alert("Please enter at least 6 characters");
                return;
            }

            firebase.auth().createUserWithEmailAndPassword(email, password);
            this.setState({ signed: true });
        } catch (error) {
            console.log(error);
        }
    }

    logInViaEmail = (email, password) => {
        try {
            if (password.length < 6) {
                alert("Please enter at least 6 characters");
                return;
            }

            firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
                // console.log(result.user.email);
                this.props.navigation.navigate('Profile');
            })
        } catch (error) {
            console.log(error);
        }
    }

    async logInViaFacebook() {
        try {
          await Facebook.initializeAsync('786955858495098');
          const { type, token } = await Facebook.logInWithReadPermissionsAsync({permissions: ['public_profile', 'email']});

          if (type === 'success') {
            const FBcredential = firebase.auth.FacebookAuthProvider.credential(token);
            firebase.auth().signInWithCredential(FBcredential)
            .then(async (result) => {
                // result.additionalUserInfo
                // mg {
                //     "isNewUser": false,
                //     "profile": Object {
                //       "birthday": "11/29/1992",
                //       "email": "makmel.miki@gmail.com",
                //       "first_name": "Miki",
                //       "gender": "male",
                //       "id": "10221659860226854",
                //       "last_name": "Makmel",
                //       "name": "Miki Makmel",
                //       "picture": Object {
                //         "data": Object {
                //           "height": 100,
                //           "is_silhouette": false,
                //           "url": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10221659860226854&height=100&width=100&ext=1592054652&hash=AeSKzSG-bOMykG4Q",
                //           "width": 100,
                //         },
                //       },
                //     },
                //     "providerId": "facebook.com",
                //   }
                this.props.navigation.navigate('SplashScreen', {socialLogin: true, email: result.user.email, profilePic: `${result.user.photoURL}?height=500`});
                console.log("Facebook Login Success");
            })
            .catch((error) => { console.log(`Facebook Login Error: ${error}`) });
          } else {
            // type === 'cancel'
            console.log("cancel");
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
          console.log(`Facebook Login Error: ${message}`);
        }
    }

    isUserEqual(googleUser, firebaseUser) {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
    }

      onSignIn(googleUser) {
        // console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.getAuthResponse().id_token);
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
          } else {
            console.log('User already signed-in Firebase.');
          }
        });
      }

      async logInViaGoogle() {
        try {
          const result = await Google.logInAsync({
            behavior: 'web',
            // androidClientId: YOUR_CLIENT_ID_HERE,
            iosClientId: '1068271769932-ro1oeq9koi558n60h5v3urc6tftakj0i.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
              console.log("success");
            //   console.log(result)
              this.onSignIn(result);
              this.props.navigation.navigate('SplashScreen', {socialLogin: true, email: result.user.email, profilePic: `${result.user.photoUrl}?height=500`});
            return result.accessToken;
          } else {
            console.log("cancel");
            return { cancelled: true };
          }
        } catch (e) {
            console.log("error");
          return { error: true };
        }
      }

  render() {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'flex-end'}} behavior="padding">
            <View style={{ width: layout.window.width, height: layout.window.height}}>
            <StatusBar barStyle="light-content" />
            <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'flex-end', height: this.state.visibleHeight}}>
                <Animated.View style={{ ...StyleSheet.absoluteFill, transform: [{ translateY: this.bgY }]}} >
                    <Svg height={layout.window.height + 50} width={layout.window.width}>
                        <ClipPath id="clip">
                            <Circle r={layout.window.height + 50} cx={layout.window.width / 2} />
                        </ClipPath>
                        <Image 
                        href={require('../assets/images/loginGradient.png')} 
                        height={layout.window.height + 50} 
                        width={layout.window.width} 
                        preserveAspectRatio={'xMidYMid slice'}
                        clipPath="url(#clip)"
                        />
                        <View style={styles.overlay} />
                    </Svg>
                </Animated.View>

                <Animatable.View style={{ position: 'absolute', top: layout.window.height/4, alignSelf: 'center'}} >
                    <Animated.Image style={{}} source={require('../assets/images/logo.png')} />
                </Animatable.View>
                
                <View style={{height: layout.window.height/3 + 40, justifyContent: 'center' }} >
                    <Animatable.View animation="fadeIn">
                        <TouchableOpacity onPress={() => this.setState({screenStatus: 'sign-in'})}>
                            <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                                <Animated.View style={{...styles.button, opacity: this.buttonOpacity, 
                                    transform: [{ translateY: this.buttonY }]
                                }}>
                                    <Text style={{fontSize: 16, fontWeight: '600', color: colors.green03, opacity: 0.9}}>SIGN IN</Text>
                                </Animated.View>
                            </TapGestureHandler>
                        </TouchableOpacity>
                    </Animatable.View>

                    
                        <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                            <Animated.View style={{padding: 10, justifyContent: 'center', alignItems: 'center', transform: [{ translateY: this.buttonY }] }}>
                                <TouchableOpacity onPress={() => this.setState({screenStatus: 'sign-up'})}>
                                    <Text>
                                        <Text style={{...styles.textForgotPassword, color: colors.white}} >Don't have an account?</Text>
                                        <Text style={{...styles.textForgotPassword, color: colors.white, fontWeight: '700'}}> Sign Up Now</Text>
                                    </Text>
                                </TouchableOpacity>  
                                <Text style={{...styles.textForgotPassword, color: colors.white, fontWeight: '200', marginTop: 30}}>- OR -</Text>
                            </Animated.View>
                        </TapGestureHandler>  

                    <Animated.View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 70, transform: [{ translateY: this.buttonY }] }}>
                        <TouchableOpacity style={styles.socialIcon} onPress={this.logInViaFacebook}>
                            <Animated.Image style={{ width: 55, height: 55, transform: [{ translateY: this.buttonY }] }} source={require('../assets/images/facebook-logo.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialIcon} onPress={this.logInViaGoogle}>
                            <Animated.Image style={{ width: 55, height: 55, transform: [{ translateY: this.buttonY }] }} source={require('../assets/images/google-logo.png')} />
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={{ 
                        height: layout.window.height/3, 
                        ...StyleSheet.absoluteFill, 
                        top: null, 
                        justifyContent: 'center',
                        zIndex: this.textInputZIndex,
                        opacity: this.textInputOpacity,
                        transform: [{translateY: this.textInputY}],
                        }} 
                    >
                        <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                            <Animated.View style={styles.closeButton} >
                                <Animated.Text style={{ fontSize: 16, fontWeight: '400', transform: [{rotate: concat(this.rotateCross, 'deg')}] }} >
                                    X
                                </Animated.Text>
                            </Animated.View>
                        </TapGestureHandler>

                        <View style={styles.inputContainer}>
                            <Feather name="mail" color={colors.blue} size={24} style={styles.inputIconLeft} />
                            <TextInput 
                            placeholder={'E-MAIL'} 
                            style={styles.textInput}
                            placeholderTextColor={colors.gray04}
                            onChangeText={(text) => this.handleEmailChange(text)}
                            autoCompleteType="email"
                            keyboardType="email-address"
                            />
                            {
                                this.state.email.length > 0 ? 
                                <Animatable.View animation="flipInX">
                                    <Feather name="check-circle" color={this.state.emailValidationColor} size={20} style={styles.inputIconRight} />
                                </Animatable.View>
                                :
                                null
                            }
                        </View>

                        <View style={styles.inputContainer}>
                            <Feather name="lock" color={colors.blue} size={20} style={styles.inputIconLeft} />
                            <TextInput 
                            placeholder={'PASSWORD'} 
                            style={styles.textInput}
                            placeholderTextColor={colors.gray04}
                            secureTextEntry={this.state.hidePassword}
                            keyboardType={Platform.OS === 'ios' ? "ascii-capable" : "visible-password"}
                            onChangeText={(text) => this.handlePasswordChange(text)}
                            />
                            {this.renderPasswordIcon()}
                        </View>

                        {this.state.screenStatus === 'sign-in' ?
                            this.renderSignIn()
                            :
                            this.renderSignUp()
                        }
                    </Animated.View>
                </View>
            </View>
            </View>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = ({ User, Customer }) => {
    return {
      hasBusiness: User.hasBusiness,
      currentUser: User.currentUser,
      favoritesList: Customer.favoritesList
    }
  }

export default connect(mapStateToProps)(LoginScreen);

function runTiming(clock, value, dest) {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0)
    };
  
    const config = {
      duration: 1000,
      toValue: new Value(0),
      easing: Easing.inOut(Easing.ease)
    };
  
    return block([
      cond(clockRunning(clock), 0, [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]),
      timing(clock, state, config),
      cond(state.finished, debug('stop clock', stopClock(clock))),
      state.position
    ]);
  }
