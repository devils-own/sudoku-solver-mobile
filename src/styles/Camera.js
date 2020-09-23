import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  imagePreview: {
    flex: 1,
  },
  previewOptionsContainer: {
    position: 'absolute',
    flex: 1,
    bottom: 0,
    left: 0,
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  retakeButtonContainer: {
    backgroundColor: 'white',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  useButtonContainer: {
    backgroundColor: 'white',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    position: 'relative',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  clickButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
