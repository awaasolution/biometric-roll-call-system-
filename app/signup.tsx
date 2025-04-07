import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";

import axios from "axios";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [profileImg, setProfileImg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOptions, setModalOptions] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const [fieldValue, setFieldValue] = useState({}); // For role and year values

  // Image Picker
  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImg(result.assets[0].uri);
    }
  };

  // Open Modal
  const openModal = (field, options) => {
    setSelectedField(field);
    setModalOptions(options);
    setModalVisible(true);
  };

  // On Select Modal Option
  const onSelect = (value) => {
    setFieldValue((prev) => ({ ...prev, [selectedField]: value }));
    setModalVisible(false);
  };

  // Form Submission
  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append text fields
    formData.append("name", data.name);
    formData.append("password", data.password);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("role", fieldValue.role); // Use selected role from fieldValue
    formData.append("rollNumber", data.rollNumber);
    formData.append("year", fieldValue.year); // Use selected year from fieldValue

    // Append image (if selected)
    if (profileImg) {
      formData.append("profileImg", {
        uri: profileImg,
        type: "image/jpeg", // Adjust based on image type
        name: "profile.jpg", // You can change the file name if needed
      });
    }

    // Debug: Log formData
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ":", pair[1]);
    // }

    // Send formData to backend
    try {
      const response = await axios.post("http://192.168.24.244:4000/api/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response.data);
      Alert.alert("Account created Successfully, Please Login");
      
      router.push('/login');
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header with Profile Image */}

      {/* Form Section */}
      <View className="p-5">
        <Text className="text-2xl font-bold text-center mb-5">Sign Up</Text>
      <View className="items-center mt-10 mb-5">
        <TouchableOpacity
          onPress={handleImagePicker}
          className="h-28 w-28 rounded-full bg-gray-200 justify-center items-center"
        >
          {profileImg ? (
            <Image
              source={{ uri: profileImg }}
              className="h-full w-full rounded-full"
            />
          ) : (
            <Text className="text-gray-500">Add Photo</Text>
          )}
        </TouchableOpacity>
        <Text className="text-sm text-gray-500 mt-2">Add Profile Photo</Text>
      </View>

        {/* Name */}
        <Text className="text-base">Name</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg p-2 mb-3`}
              placeholder="Enter your name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.name && <Text className="text-red-500">{errors.name.message}</Text>}

        {/* Email */}
        <Text className="text-base">Email</Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg p-2 mb-3`}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500">{errors.email.message}</Text>
        )}

        {/* Phone */}
        <Text className="text-base">Phone</Text>
        <Controller
          control={control}
          name="phone"
          rules={{ required: "Phone number is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-lg p-2 mb-3`}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.phone && (
          <Text className="text-red-500">{errors.phone.message}</Text>
        )}

        {/* Password */}
        <Text className="text-base">Password</Text>
        <Controller
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg p-2 mb-3`}
              placeholder="Enter your password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500">{errors.password.message}</Text>
        )}

        {/* Roll Number */}
        <Text className="text-base">Roll Number</Text>
        <Controller
          control={control}
          name="rollNumber"
          rules={{ required: "Roll Number is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`border ${
                errors.rollNumber ? "border-red-500" : "border-gray-300"
              } rounded-lg p-2 mb-3`}
              placeholder="Enter your roll number"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
            />
          )}
        />
        {errors.rollNumber && (
          <Text className="text-red-500">{errors.rollNumber.message}</Text>
        )}

        {/* Role */}
        <Text className="text-base">Role</Text>
        <TouchableOpacity
          className="border border-gray-300 rounded-lg p-2 mb-3"
          onPress={() => openModal("role", ["admin", "student"])}
        >
          <Text>{fieldValue.role || "Select your role"}</Text>
        </TouchableOpacity>

        {/* Year */}
        <Text className="text-base">Year</Text>
        <TouchableOpacity
          className="border border-gray-300 rounded-lg p-2 mb-3"
          onPress={() =>
            openModal("year", [
              "First Year",
              "Second Year",
              "Third Year",
              "Fourth Year",
              "Fifth Year",
            ])
          }
        >
          <Text>{fieldValue.year || "Select your year"}</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-blue-500 rounded-lg p-3 mt-5"
        >
          <Text className="text-white text-center font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal transparent={true} visible={modalVisible}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-5 w-4/5">
            <FlatList
              data={modalOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="border-b border-gray-300 p-3"
                  onPress={() => onSelect(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-3 bg-red-500 rounded-lg p-2"
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
