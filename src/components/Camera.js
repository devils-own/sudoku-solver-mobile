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

  const getPromiseForSudokuSolver = (imageAsBase64) => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        OpenCV.sudokuSolvedImage(
          imageAsBase64,
          (error) => {
            // error handling
          },
          (msg) => {
            resolve(msg);
          },
        );
      } else {
        OpenCV.sudokuSolvedImage(imageAsBase64, (error, dataArray) => {
          console.log(dataArray[0]);
          resolve(dataArray[0]);
        });
      }
    });
  };

  const getSolvedSudoku = (imageData) => {
    console.log('Get Solved Sudoku Fnc Called');

    getPromiseForSudokuSolver(imageData.base64)
      .then((solvedPhoto) => {
        setContent(solvedPhoto);
        setIsPhotoPreview(true);
        setPhotoPath(imageData.uri);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const takePicture = async () => {
    // Take Photo and save it.
    console.log('Take Picture Fnc Called');

    if (camera != null) {
      const options = {quality: 0.5, base64: true};
      const data = await camera.takePictureAsync(options);

      setIsPhotoPreview(false);

      getSolvedSudoku(data);

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
