import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

const screenWidth = Layout.window.width;
const screenHeight = Layout.window.height;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 35,
    color: Colors.gray04,
    marginTop: 50,
    paddingLeft: 20
  },
  secondaryHeadline: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.gray02,
    paddingLeft: 20,
    marginTop: 30,
    marginBottom: 5
  },
})
