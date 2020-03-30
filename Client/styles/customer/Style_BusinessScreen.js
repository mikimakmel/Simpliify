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
      }
})
