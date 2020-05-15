import { StyleSheet } from 'react-native'
import colors from '../../constants/Colors'

export default StyleSheet.create({
  calendar: {
    paddingTop: 5,
    height: 350
  },
  text: {
    textAlign: 'center',
    fontWeight: '400',
    color: colors.black,
    padding: 8,
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: colors.gray05,
    opacity: 0.9
  },
  container: {
    flex: 1
  },
  ListTitle: {
    color: colors.black,
    opacity: 0.8,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10
  },
  ListSubtitle: {
    color: '#afb8bb',
    paddingLeft: 5,
    fontWeight: '500',
    fontSize: 14
  },
  ButtonContainer: {
    width: 75, 
    marginRight: 5 
  },
  ButtonStyling: {
    borderRadius: 20,
    borderColor: '#0E778C',
    borderWidth: 1.5,
  },
  ButtonTitleStyling: {
    color: '#0E778C',
    fontWeight: '400',
    fontSize: 14
  },
  overlayContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center'
  },
  overlaySucess: {
    height: 100, 
    width: 100,
    position: 'absolute',
    top: 140
  },
  overlayHeadingText: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.red,
    marginBottom: 60
  },
  overlayText: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.gray03,
    textAlign: 'center'
  },
  overlaySaveButton: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.red,
    marginTop: 80,
    textDecorationLine: 'underline'
  },
  overlayDontSaveButton: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.red,
    marginTop: 30,
    textDecorationLine: 'underline'
  }
})
