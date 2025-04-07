import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";
import loggedUserStore from "@/stores/userDataStore";
import * as FileSystem from "expo-file-system";
import images from "@/constants/images";


export default function FaceDetectionScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [detections, setDetections] = useState({
    faceDetected: false,
    smiling: false,
    winking: false,
    blinking: false,
  });
  const loggedUserId = loggedUserStore((state) => state.loggedUserData.loggedUserId);
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [cameraRef, setCameraRef] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showMarkScreen, setShowMarkScreen] = useState(true)

  const steps = ["Smile", "Wink", "Blink"];

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.front
        ? Camera.Constants.Type.back
        : Camera.Constants.Type.front
    );
  };

  const toggleFlash = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off
    );
  };

  const handleFacesDetected = ({ faces }) => {
    if (faces.length !== 1) {
      setDetections({
        faceDetected: false,
        smiling: false,
        winking: false,
        blinking: false,
      });
      setCurrentStep(0);
      return;
    }

    const face = faces[0];
    const isSmiling = face.smilingProbability > 0.5;
    const isWinking =
      (face.leftEyeOpenProbability < 0.3 &&
        face.rightEyeOpenProbability > 0.5) ||
      (face.rightEyeOpenProbability < 0.3 &&
        face.leftEyeOpenProbability > 0.5);
    const isBlinking =
      face.leftEyeOpenProbability < 0.3 &&
      face.rightEyeOpenProbability < 0.3;

    setDetections({
      faceDetected: true,
      smiling: isSmiling,
      winking: isWinking,
      blinking: isBlinking,
    });

    if (currentStep === 0 && isSmiling) {
      setCurrentStep(1);
    } else if (currentStep === 1 && isWinking) {
      setCurrentStep(2);
    } else if (currentStep === 2 && isBlinking) {
      takePhoto();
    }
  };

  const takePhoto = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setCapturedPhoto(photo.uri);
      setShowMarkScreen(false)

      // Reset detection steps and detections
      setDetections({
        faceDetected: false,
        smiling: false,
        winking: false,
        blinking: false,
      });
      setCurrentStep(0);

      // Send photo to server
      await sendPhotoToServer(photo.uri);


    }
  };

const sendPhotoToServer = async (photoUri) => {
  try {
    // Get file information
    const fileInfo = await FileSystem.getInfoAsync(photoUri);
    const fileUri = fileInfo.uri;

    // Extract the file extension and determine MIME type
    const fileType = fileUri.split(".").pop();
    const mimeType = `image/${fileType}`;

    // Create FormData with the dynamically determined MIME type
    const formData = new FormData();
    formData.append("photo", {
      uri: fileUri,
      name: `realtimePhoto.${fileType}`, // Consistent file naming
      type: mimeType,
    });

    // Make the API request
    const response = await fetch(
      `http://192.168.24.244:4000/api/realtime/compare/${loggedUserId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );
    console.log("This is response", response)
    if (!response.ok) {
      throw new Error(`Failed to upload photo. Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Photo uploaded successfully:", data);

          // Navigate to Result Screen
      router.push({
        pathname: "/resultScreen",
        params: {
            status: data['status'],
            is_match: data['is_match'],
            loggedUserId: loggedUserId,
         },
      });

    
  } catch (error) {
    Alert.alert("Upload Error", "Failed to send the photo to the server.");
    console.error(error);
  }
};

  if (!hasPermission) {
    return <Text className="text-center text-white">No access to camera</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
     {
      showMarkScreen ? 

      (
        

        <>
 <View className="flex-row justify-between items-center m-2">
        <TouchableOpacity>
          <Image source={icons.backArrow} className="w-8 h-8" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Camera</Text>
        <TouchableOpacity>
          <Image source={icons.bell} className="w-7 h-7" />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-evenly items-center">
        <TouchableOpacity onPress={toggleFlash}>
          <Ionicons
            name={flashMode === Camera.Constants.FlashMode.off ? "flash-off" : "flash"}
            size={20}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCameraType}>
          <Ionicons name="camera-reverse" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center">
        <View className="w-5/6 h-1/2 rounded-lg border border-red-400 m-5 overflow-hidden">
          <Camera
            style={{ flex: 1 }}
            type={cameraType}
            flashMode={flashMode}
            ref={(ref) => setCameraRef(ref)}
            onFacesDetected={handleFacesDetected}
            faceDetectorSettings={{
              mode: FaceDetector.FaceDetectorMode.fast,
              detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
              runClassifications: FaceDetector.FaceDetectorClassifications.all,
            }}
          />
        </View>

        <View className="w-5/6 bg-gray-100 rounded-lg p-4">
          {detections.faceDetected ? (
            <Text className="text-green-600 text-center">
              {currentStep < steps.length
                ? `Step ${currentStep + 1}: ${steps[currentStep]}`
                : "Completed! Taking photo..."}
            </Text>
          ) : (
            <Text className="text-gray-500 text-center">
              Align your face in the frame.
            </Text>
          )}
        </View>
      </View>
        </>
      )

      : 


      (
        <SafeAreaView className='h-full bg-white'>
            <View className='flex-col h-full ml-2 mr-2 gap-5'>
            <View className='flex-col items-center'>
                <Image
                    source={icons.dumbell}
                    resizeMode='cover'
                    className='size-8'
                    />
                    <Text className='font-bold text-2xl'>
                        UCSM
                    </Text>
            </View>
            <View className=' flex justify-center h-1/2'>
                <Image source={images.faceReco} resizeMode='contain' className='w-full h-full'/>
            </View>
            <View className='flex-col justify-center items-center'>
                <Text className='text-2xl font-semibold'>
                  
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                      </View>
                </Text>
                <Text className='text-center text-gray-400'>Your data will not be stored 
                    for more than 2 days {`\n`}
                    in any server or databases</Text>
            </View>
            <View className='absolute bottom-2 w-full'>
                <TouchableOpacity className='w-full flex-row justify-center items-center h-20 bg-blue-600 rounded-3xl'>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                      </View>
                </TouchableOpacity>
            </View>
            </View>
        </SafeAreaView>
      )
     }
    </SafeAreaView>
  );
}
