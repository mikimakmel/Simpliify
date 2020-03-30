import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../constants/Colors';
import layout from '../../constants/Layout';

const screenWidth = layout.window.width;

export default StyleSheet.create({
  scrollView: {
    height: '100%',
    backgroundColor: 'white'
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 5,
    color: colors.gray04,
    marginTop: 20,
    paddingLeft: 20
  },
  rating: {
    alignItems: 'flex-start',
    marginLeft: 20
  },
  rowItems: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  managerWordContainer: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 10
  },
  managerAvatar: {
    marginLeft: 15,
    marginRight: 20
  },
  managerTextContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 5
  },
  managerText: {
    flex: 1,
    flexWrap: 'wrap',
    overflow: 'hidden',
    color: colors.gray04,
    fontSize: 12,
    fontWeight: '300'
  },
  dividerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 20
  },
  divider: {
    height: 0.8,
    width: screenWidth - 48,
    backgroundColor: '#e1e8ee'
  },
  leftAlign: {
    paddingLeft: 20
  },
  infoRowsContainer: {
    height: 50,
    width: '100%',
    marginBottom: 5
  },
  iconsCircle: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 40 / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconsText: {
    paddingLeft: 15,
    fontSize: 14,
    fontWeight: '500',
    color: colors.lightBlack
  },
  hoursTextContainer: {
    paddingLeft: 76
  },
  daysText: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.lightBlack
  },
  hoursText: {
    fontSize: 12,
    position: 'absolute',
    marginLeft: 175,
    fontWeight: '300',
    color: colors.lightBlack
  },
  mapContainer: {
    height: 120,
    width: 160,
    borderWidth: 0.7,
    borderColor: colors.gray05,
    marginLeft: 75,
    marginBottom: 20
  },
  map: {
    height: '100%',
    width: '100%',
    alignSelf: 'center'
  }
})
