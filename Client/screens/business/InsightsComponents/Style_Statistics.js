import { StyleSheet } from 'react-native'
import colors from '../../../constants/Colors';

export default StyleSheet.create({
  itemStyle: {
    width: 20,
    height: 20,
  },
  headline: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 20,
  },
  subHeadline: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 25
  },
  chart: {
    backgroundColor: colors.white,
    borderRadius: 50,
    margin: 20
  },
  horizontalLine: {
    marginBottom: 10,
  },
  itemMargin: {
    marginLeft: 20,
    marginRight: 20,
  },
  viewers: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: colors.black
  }
})