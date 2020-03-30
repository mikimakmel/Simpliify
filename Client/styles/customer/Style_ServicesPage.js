import { StyleSheet } from 'react-native'
import colors from '../../constants/Colors'

export default StyleSheet.create({
  scrollView: {
    height: '100%',
    backgroundColor: 'white'
  },
  pricingCardContainer: {
    width: 260,
    height: 170,
    borderWidth: 1.5,
    borderColor: colors.gray06,
    marginBottom: 35,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowColor: colors.gray04,
    shadowOpacity: 0.3,
    elevation: 3
  },
  titleText: {
    marginTop: 13,
    color: colors.lightBlack,
    fontSize: 20,
    fontWeight: '500'
  },
  priceText: {
    marginTop: 8,
    color: '#0E778C',
    fontSize: 18,
    fontWeight: '600'
  },
  durationText: {
    marginTop: 8,
    color: '#afb8bb',
    fontSize: 12,
    fontWeight: '400'
  },
  descriptionText: {
    marginTop: 5,
    color: colors.gray02,
    fontSize: 16,
    fontWeight: '400'
  },
  bookButtonContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
    width: 120,
    height: 35,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
    shadowColor: colors.gray04,
    shadowOpacity: 0.3,
    elevation: 3
  },
  bookButton: {
    backgroundColor: colors.white,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderRadius: 4,
    borderColor: '#0E778C'
  },
  bookButtonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E778C'
  }
})
