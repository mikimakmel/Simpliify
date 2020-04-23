import { StyleSheet, Platform, StatusBar } from 'react-native';
import colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

const screenWidth = Layout.window.width;
const screenHeight = Layout.window.height;

export default StyleSheet.create({
  flexContainer: {
    flex: 1
  },
  tabBarUnderline: {
    height: 2,
    backgroundColor: colors.red
  },
  headerRightIcon: {
    marginRight: 2,
    marginTop: 4
  },
  askToJoinContainer: {
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    height: 60,
    width: '100%',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowColor: colors.gray04,
    shadowOpacity: 0.35
  },
  askToJoinInsideContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  joinButtonContainer: {
    position: 'absolute',
    right: 0,
    height: 40,
    width: 120,
    marginRight: 20
  },
  joinButton: {
    backgroundColor: colors.red,
    width: '100%',
    height: '100%',
    borderWidth: 0.1,
    borderColor: colors.black
  },
  joinButtonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  joinTextContainer: {
    backgroundColor: 'grey',
    marginLeft: 20,
    alignSelf: 'flex-start'
  },
  joinText: {
    color: colors.gray04,
    opacity: 0.9,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'left',
    marginLeft: 20
  },
  overlayContainer: {
    alignItems: 'center'
  },
  overlayHeadingText: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.red,
    opacity: 0.8,
    marginTop: 220
  },
  overlayText: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.gray03,
    marginTop: 20,
    textAlign: 'center'
  },
  overlayButton: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.red,
    marginTop: 250,
    textDecorationLine: 'underline'
  },
  tabBarText: {
    fontSize: 15,
    fontWeight: '400'
  },
  topMenuContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 25,
    right: 25
  },
  topMenu: {
    width: 180
  },
  topMenuItem: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  ImagesSwiperContainer: {
    height: 200
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 5,
    color: colors.gray04,
    marginTop: 20,
    paddingLeft: 20
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
    marginLeft: 20,
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
    marginTop: 5,
    marginRight: 5,
    flexShrink: 1
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
  rowItems: {
    flexDirection: 'row',
    alignItems: 'center',
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
  daysText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.lightBlack
  },
  hoursTextContainer: {
    paddingLeft: 76,
    marginBottom: 10,
  },
  hoursText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.lightBlack,
    padding: 3
  },
})
