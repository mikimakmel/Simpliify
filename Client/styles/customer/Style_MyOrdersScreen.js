import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

const screenWidth = Layout.window.width;

export default StyleSheet.create({
  scrollView: {
    height: '100%'
  },
  flexContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  avatarContiner: {
    marginLeft: 15
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 35,
    color: Colors.gray04,
    marginTop: 50,
    paddingLeft: 20,
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  titleText: {
    color: Colors.black,
    opacity: 0.85,
    fontSize: 16,
    fontWeight: '700'
  },
  serviceText: {
    color: Colors.lightBlack,
    opacity: 0.85,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6
  },
  dateText: {
    color: '#afb8bb',
    fontSize: 14,
    fontWeight: '400'
  },
  dividerContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 5
  },
  divider: {
    height: 1.1,
    width: '100%',
    backgroundColor: Colors.gray03,
    opacity: 0.25
  },
  eventContainer: {
    backgroundColor: 'white',
    height: 160,
    width: screenWidth
  },
  infoBoxContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 100,
    alignItems: 'center'
  },
  textLeftAlign: {
    marginLeft: 25
  },
  shadowBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
    marginHorizontal: 20,
    marginVertical: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowColor: 'grey',
    shadowOpacity: 0.3,
    elevation: 6
  },
  getDirectionsContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9'
  },
  getDirectionsText: {
    color: Colors.blue,
    opacity: 0.9,
    fontSize: 13,
    fontWeight: '600'
  },
  getDirectionsButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  getDirectionsIcon: {
    marginRight: 5
  },
  emptyListContainer: {
    backgroundColor: Colors.white,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1
  },
  emptyListIcon: {
    width: 120,
    height: 120,
  },
  emptyListTextContainer: {
    marginTop: 30,
    marginBottom: 150,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  emptyListHeadingText: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.gray04,
    opacity: 0.8
  },
  emptyListText: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.gray03,
    marginTop: 20,
    textAlign: 'center'
  },
  toggleContainer: {
    width: '100%', 
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    backgroundColor: 'white', 
    alignContent: 'center', 
    marginBottom: 30,
    backgroundColor: 'rgba(249, 249, 249, 0.7)',
    opacity: 0.9,
    borderRadius: 5,
    alignSelf: 'center',
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 3,
    shadowColor: 'grey',
    shadowOpacity: 0.20,
    elevation: 5
  },
  chosenTab: {
    width: '40%', 
    borderBottomWidth: 2, 
    borderBottomColor: Colors.red,
    paddingVertical: 8
  },
  chosenText: {
    fontSize: 16, 
    fontWeight: '500', 
    color: Colors.red, 
    borderBottomWidth: 2, 
    borderBottomColor: 'blue', 
    alignSelf: 'center', 
  },
  unChosenTab: {
    width: '40%',
    paddingVertical: 8
  },
  unChosenText: {
    fontSize: 16, 
    fontWeight: '300', 
    color: Colors.gray02, 
    borderBottomWidth: 2, 
    borderBottomColor: 'blue', 
    alignSelf: 'center', 
  },
})
