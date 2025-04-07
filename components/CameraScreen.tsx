import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  
  // Handle face detection
  const handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      console.log('Face detected!', faces);
      // You can use this data to highlight faces, update state, etc.
    } else {
      console.log('No faces detected');
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View className="flex-1 justify-center items-center"><Text>Requesting camera permissions...</Text></View>;
  }
  
  if (hasPermission === false) {
    return <View className="flex-1 justify-center items-center"><Text>No access to camera</Text></View>;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View className="w-80 h-80 rounded-full border border-red-400 m-5 overflow-hidden">
        <Camera
          style={{ flex: 1 }}
          type={cameraType}
          flashMode={flashMode}
          onFacesDetected={handleFacesDetected}  // Call the function here
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
          }}
        />
      </View>
    </View>
  );
};

export default CameraScreen;
