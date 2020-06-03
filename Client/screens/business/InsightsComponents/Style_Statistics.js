import { StyleSheet } from 'react-native'
import colors from '../../../constants/Colors';

export default StyleSheet.create({
  itemStyle: {
    width: 20,
    height: 20,
  },
  headline: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20,
    color: colors.lightBlack,
  },
  subHeadline: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 25,
    color: colors.gray03,
  },
  chart: {
    borderWidth: 0.1,
    borderColor: colors.gray04,
    backgroundColor: colors.white,
    borderRadius: 40,
    margin: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    shadowColor: colors.gray04,
    shadowOpacity: 0.1,
    width: '85%',
    alignSelf: 'center'
  },
  horizontalLine: {
    marginBottom: 10,
  },
  itemMargin: {
    marginLeft: 20,
    marginRight: 20,
  },
  viewersContainer: {
    justifyContent: 'center', 
    alignContent: 'center', 
    // backgroundColor: colors.gray01, 
    opacity: 0.8, 
    // borderWidth: 0.1, 
    // borderColor: colors.gray04,
    borderRadius: 5,
    marginBottom: 20,
  },
  viewers: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    color: colors.lightBlack
  },
  insightsHeadline: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 35,
    color: colors.gray04,
    marginTop: 50,
    paddingLeft: 20
  },
})