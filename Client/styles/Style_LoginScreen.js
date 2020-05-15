import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

const screenWidth = Layout.window.width;
const screenHeight = Layout.window.height;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.25,
    backgroundColor: 'white',
    width: screenWidth,
    height: screenHeight + 50,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 50,
    marginHorizontal: 50,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: Colors.lightBlack,
    shadowRadius: 4,
    shadowOpacity: 0.5,
    borderWidth: 0.3,
    borderColor: Colors.lightBlack,
  },
  closeButton: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -20,
    left: Layout.window.width / 2 - 20,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
  },
  textInput: {
    flex: 1,
    paddingLeft: 15,
    paddingTop: 3,
    fontSize: 14,
    fontWeight: '400'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    borderRadius: 25,
    borderWidth: 0.5,
    marginHorizontal: 22,
    paddingLeft: 10,
    marginVertical: 5,
    borderColor: 'rgba(0,0,0,0.2)',
    backgroundColor: 'white'
  },
  inputIconLeft: {
    paddingLeft: 5,
  },
  inputIconRight: {
    paddingRight: 15,
  },
  forgotPasswordContainer: {
    marginHorizontal: 25,
    padding: 10,
  },
  textForgotPassword: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.blue
  },
  socialIcon: {
    margin: 20,
    borderRadius: 55/2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    opacity: 0.9,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: Colors.gray04,
    shadowRadius: 4,
    shadowOpacity: 0.4,
  }
})
