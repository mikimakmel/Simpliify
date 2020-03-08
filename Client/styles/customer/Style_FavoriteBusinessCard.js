import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

const screenWidth = Layout.window.width;

export default StyleSheet.create({
  scrollView: {
    height: '100%'
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 30,
    color: Colors.gray04,
    marginTop: 70,
    paddingLeft: 20,
    paddingRight: 20
  },
  dividerContainer: {
    flex: 1,
    alignItems: 'center'
  },
  divider: {
    height: 1.1,
    width: screenWidth - 42,
    backgroundColor: Colors.gray03,
    opacity: 0.25
  },
  imageContainer: {
    paddingHorizontal: 20,
    height: 220,
    width: screenWidth,
    marginTop: 25,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
    shadowColor: 'grey',
    shadowOpacity: 0.25,
    elevation: 3
  },
  image: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'cover',
    borderRadius: 1
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray04
  },
  noUpcomingText: {
    fontSize: 10,
    fontWeight: '200',
    color: Colors.gray04,
    opacity: 0.6,
    marginTop: 6
  },
  upcomingText: {
    fontSize: 10,
    fontWeight: '200',
    color: Colors.green02,
    opacity: 0.6,
    marginTop: 6
  }
})
