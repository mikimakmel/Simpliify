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
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gray04,
    paddingLeft: 20,
    marginBottom: 5
  },
})
