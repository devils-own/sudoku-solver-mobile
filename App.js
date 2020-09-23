import React from 'react';
import {StatusBar} from 'react-native';

import Camera from './src/components/Camera';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Camera />
    </>
  );
};

export default App;
