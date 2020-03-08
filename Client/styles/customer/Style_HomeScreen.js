import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  scrollView: {
    height: '100%'
  },
  flexContainer: {
    flex: 1,
    backgroundColor: Colors.white
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 25,
    color: Colors.gray04,
    marginTop: 50,
    paddingLeft: 20
  },
  emptyListContainer: {
    backgroundColor: Colors.white,
    width: '100%',
    alignItems: 'center',
    marginTop: 50
  },
  emptyListIcon: {
    width: 100,
    height: 100,
    marginTop: 50
  },
  emptyListTextContainer: {
    marginTop: 45,
    alignItems: 'center'
  },
  emptyListHeadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.gray04,
    opacity: 0.8
  },
  emptyListText: {
    fontSize: 12,
    fontWeight: '300',
    color: Colors.gray03,
    marginTop: 20,
    textAlign: 'center'
  },
  FindServicesButton: {
    backgroundColor: Colors.red,
    width: 200,
    height: 50,
    marginTop: 100,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowColor: Colors.red,
    shadowOpacity: 0.3,
    elevation: 3,
    borderWidth: 0.2,
    borderColor: Colors.lightBlack,
    borderRadius: 80,
    alignItems: 'center'
  },
  FindServicesButtonTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  }
})
