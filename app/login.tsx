import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Modal, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import images from "@/constants/images";
import loggedUserStore from "@/stores/userDataStore";
import { router } from "expo-router";

const LoginForm = () => {
  const [inputRollNumber, setInputRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const loggedUserData = loggedUserStore((state) => state.loggedUserData);
  const setLoggedUserData = loggedUserStore((state) => state.setLoggedUserData);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isSuccessVisible, setSuccessVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Tracks the loading state

  const toggleAlertModal = () => {
    setAlertVisible(!isAlertVisible);
  };

  const toggleSuccessModal = () => {
    setSuccessVisible(!isSuccessVisible);
  };

  const handleLogin = async () => {
    setLoading(true); // Start the loading process
    try {
      const response = await axios.post("http://192.168.24.244:4000/api/auth/login", {
        rollNumber: inputRollNumber,
        password,
      });

      await AsyncStorage.clear();

      const loggedUserToken = response.data.token;
      const loggedUserId = response.data.user._id;
      const {
        name: loggedUserName,
        role: loggedUserRole,
        profileImg: loggedUserProfileImg,
        rollNumber: loggedUserRollNumber,
        year: loggedUserYear,
        appliedFaceReko: loggedUserAppliedFaceReko,
        phoneNumber: loggedUserPhoneNumber,
        email: loggedUserEmail
      } = response.data.user;

      console.log("response.data.user", response.data.user)
      await AsyncStorage.multiSet([
        ["@loggedUserId", loggedUserId],
        ["@loggedUserName", loggedUserName],
        ["@loggedUserRole", loggedUserRole],
        ["@loggedUserYear", loggedUserYear],
        ["@loggedUserProfileImg", loggedUserProfileImg],
        ["@loggedUserRollNumber", loggedUserRollNumber],
        ["@loggedUserToken", loggedUserToken],
        ["@loggedUserAppliedFaceReko", String(loggedUserAppliedFaceReko)],
        ["@loggedUserEmail", loggedUserEmail],
        ["@loggedUserPhoneNumber", loggedUserPhoneNumber]

        
      ]);

      setLoggedUserData({
        loggedUserId,
        loggedUserName,
        loggedUserRole,
        loggedUserProfileImg,
        loggedUserRollNumber,
        loggedUserToken,
        loggedUserYear,
        loggedUserAppliedFaceReko,
        loggedUserAttendanceMarked: 0,
        loggedUserEmail,
        loggedUserPhoneNumber
      });

      setLoading(false); // Stop loading
      setSuccessVisible(true); // Show the success modal
    } catch (error) {
      setLoading(false); // Stop loading on error
      setAlertMessage(error.response?.data?.message || "An error occurred"); // Set alert message
      toggleAlertModal(); // Show the error modal
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 px-4">
      <Image source={images.ucsLogo} className="w-32 h-32 rounded-full mb-6" />
      <Text className="text-xl font-bold mb-4">Login</Text>

      <TextInput
        placeholder="Roll Number"
        value={inputRollNumber}
        onChangeText={setInputRollNumber}
        className="w-full bg-white p-4 rounded-lg shadow mb-4"
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        className="w-full bg-white p-4 rounded-lg shadow mb-6"
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="w-full bg-blue-500 py-4 rounded-lg items-center shadow"
      >
        <Text className="text-white font-bold">Login</Text>
      </TouchableOpacity>


    <Text className="text-gray-500">
      Or
    </Text>
      <TouchableOpacity onPress={() => router.push("/signup")}
        className="w-full bg-blue-500 py-4 rounded-lg items-center shadow"
      >
        <Text>Sign Up</Text>
      </TouchableOpacity>

      {/* Error Modal */}
      <Modal
        transparent={true}
        visible={isAlertVisible}
        animationType="fade"
        onRequestClose={toggleAlertModal}
      >
        <View className="flex-1 justify-center items-center bg-gray-200 bg-opacity-50">
          <View className="w-10/12 bg-white rounded-lg p-5 items-center">
            <Text className="text-lg font-bold text-red-500 mb-4">Error!</Text>
            <Text className="text-gray-700 text-center mb-6">{alertMessage}</Text>
            <TouchableOpacity
              onPress={toggleAlertModal}
              className="bg-blue-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        transparent={true}
        visible={isSuccessVisible}
        animationType="fade"
        onRequestClose={toggleSuccessModal}
      >
        <View className="flex-1 justify-center items-center bg-gray-200 bg-opacity-50">
          <View className="w-10/12 bg-white rounded-lg p-5 items-center">
            <Text className="text-lg font-bold text-green-500 mb-4">Login Successful!</Text>
            <Text className="text-gray-700 text-center mb-6">
              Welcome back, {loggedUserData.loggedUserName}!
            </Text>
            <TouchableOpacity
              onPress={() => {
                toggleSuccessModal();
                router.replace("/(root)/(tabs)"); // Navigate after closing modal
              }}
              className="bg-blue-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal
        transparent={true}
        visible={loading}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View className="flex-1 justify-center items-center bg-gray-200 bg-opacity-50">
          <View className="w-10/12 bg-white rounded-lg p-5 items-center">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="text-gray-700 text-center mt-4">Logging in...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginForm;
