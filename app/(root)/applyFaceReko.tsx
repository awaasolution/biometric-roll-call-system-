import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import loggedUserStore from "@/stores/userDataStore";
import { router } from "expo-router";

export default function CameraGalleryUploader() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState(null);
  const loggedUserId = loggedUserStore(state=>state.loggedUserData.loggedUserId)

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const takePhoto = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setImage(photo.uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow all image types
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const toggleCameraType = () => {
    setCameraType((prevType) =>
      prevType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const uploadImage = async () => {
    if (!image) return;

    const fileInfo = await FileSystem.getInfoAsync(image);
    const fileUri = fileInfo.uri;

    // Dynamically determine MIME type based on file extension
    const fileType = fileUri.split(".").pop();
    const mimeType = `image/${fileType}`;

    const formData = new FormData();
    formData.append("image", {
      uri: fileUri,
      name: `uploaded_image.${fileType}`,
      type: mimeType,
    });

    try {
      const response = await fetch(`http://192.168.24.244:4000/api/users/verify/photo/${loggedUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Upload successful:", data);

      router.replace('/(root)/(tabs)')
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const retakePhoto = () => {
    setImage(null);
  };

  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <Text>Requesting permissions...</Text>;
  }

  if (!hasCameraPermission || !hasGalleryPermission) {
    return <Text>Permission for camera or gallery is not granted.</Text>;
  }

  return (
    <View style={styles.container}>
      {!image && (
        <Camera
          style={styles.camera}
          type={cameraType}
          ref={(ref) => setCamera(ref)}
        />
      )}

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <View style={styles.buttons}>
        {!image && (
          <>
            <TouchableOpacity onPress={takePhoto} style={styles.button}>
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCameraType} style={styles.button}>
              <Text style={styles.buttonText}>
                Switch to {cameraType === Camera.Constants.Type.back ? "Front" : "Back"} Camera
              </Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </TouchableOpacity>
        {image && (
          <>
            <TouchableOpacity onPress={uploadImage} style={styles.button}>
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={retakePhoto} style={styles.button}>
              <Text style={styles.buttonText}>Retake Photo</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  camera: {
    width: "100%",
    height: "60%",
  },
  preview: {
    width: "100%",
    height: "60%",
    resizeMode: "contain",
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
