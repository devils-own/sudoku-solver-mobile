import React, {useState} from 'react';
import {View, Text, Platform, Image, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Toast from 'react-native-easy-toast';

import styles from '../styles/Camera';
import OpenCV from '../native_modules/OpenCV';
import CirclePhotoClick from '../assets/CirclePhotoClick';

const Camera = (props) => {
  const [content, setContent] = useState('');
  const [isPhotoPreview, setIsPhotoPreview] = useState(false);
  const [photoPath, setPhotoPath] = useState('');

  const [toastRef, setToastRef] = useState();
  const [camera, setCamera] = useState(null);

  const takePicture = async () => {
    // Take Photo and save it.
    if (camera != null) {
      const options = {quality: 0.5, base64: true};
      const data = await camera.takePictureAsync(options);

      setContent(data.base64);
      setIsPhotoPreview(true);
      setPhotoPath(data.uri);

      toastRef.show('Clicked!', 1000);
    }
  };

  const retakePhoto = () => {
    setContent('');
    setIsPhotoPreview(false);
    setPhotoPath('');
  };

  const usePhoto = () => {};

  return (
    <View style={styles.container}>
      <Toast
        ref={(ref) => {
          setToastRef(ref);
        }}
        position="center"
      />
      {isPhotoPreview ? (
        <>
          <Image
            source={{uri: `data:image/png;base64,${content}`}}
            style={styles.imagePreview}
          />
          <View style={styles.previewOptionsContainer}>
            <TouchableOpacity
              style={styles.retakeButtonContainer}
              onPress={retakePhoto}>
              <Text>RETAKE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.useButtonContainer}
              onPress={usePhoto}>
              <Text>USE</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <RNCamera
            ref={(cam) => {
              setCamera(cam);
            }}
            style={styles.preview}>
            <View style={styles.clickButtonContainer}>
              <TouchableOpacity onPress={takePicture}>
                <CirclePhotoClick />
              </TouchableOpacity>
            </View>
          </RNCamera>
        </>
      )}
    </View>
  );
};

export default Camera;
