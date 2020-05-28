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
    marginBottom: 10
  },
  chart: {
    // backgroundColor: colors.gray06,
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
    marginBottom: 10,
    color: colors.white
  }
})