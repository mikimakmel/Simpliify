import { StyleSheet, Platform, StatusBar } from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

const screenWidth = Layout.window.width;
const screenHeight = Layout.window.height;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: Platform.OS === 'android' ? 120 + StatusBar.currentHeight : 120,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    marginHorizontal: 24,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 7,
    shadowColor: Colors.gray04,
    shadowOpacity: 0.2,
    elevation: 3,
    marginTop: Platform.OS === 'android' ? 30 : null,
    height: 50,
    borderRadius: 6,
    borderWidth: 0.7,
    borderColor: Colors.gray05,
    zIndex: 2
  },
  searchIcon: {
    paddingLeft: 5
  },
  closeIcon: {
    marginTop: 1,
    opacity: 0.6
  },
  textInputBox: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.red,
    opacity: 0.85,
    backgroundColor: 'white',
    paddingLeft: 20,
    marginTop: 2.5
  },
  categoriesText: {
    color: Colors.gray04,
    fontSize: 22,
    fontWeight: '600',
    paddingHorizontal: 24
  },
  titleText: {
    color: Colors.black,
    opacity: 0.85,
    fontSize: 17,
    fontWeight: '600'
  },
  subtitleText: {
    color: '#afb8bb',
    fontSize: 14,
    fontWeight: '500'
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center'
  },
  rankingText: {
    color: 'grey',
    fontSize: 10,
    marginLeft: 4
  },
  adContainer: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 3,
    marginRight: 10
  },
  adText: {
    color: 'green',
    fontSize: 10,
    marginHorizontal: 3,
    marginVertical: 2
  },
  indicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  noResultsContainer: {
    flex: 1,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noResultsText: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.gray03,
    textAlign: 'center'
  },
  recomendedHeadline: {
    color: Colors.gray04,
    fontSize: 24,
    fontWeight: '600',
    paddingHorizontal: 24
  },
  recommendedCardContainer: {
    width: (screenWidth/2) - 34,
    height: (screenHeight/4),
    paddingBottom: 25
  },
})
