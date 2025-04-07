

import { ScrollView, Image} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import icons from '@/constants/icons'
import { router } from 'expo-router'
// import { registerRootComponent } from 'expo';
// import "expo-router/entry";



import React, { useState, useEffect } from "react";
import { View, Text, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [isInAllowedRegion, setIsInAllowedRegion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


    const handleLogin = ()=>{
    router.replace('/login')
  }
  // project show test region

  // latitude: 21.954482,
  // longitude: 96.083173, 

  // Predefined allowed region
  
    //   latitude: 21.7905242,
    // longitude: 96.1158932, 

  const predefinedRegion = {
      latitude: 21.7905242,
    longitude: 96.1158932, 
  
    //   latitude: 21.7905242,
    // longitude: 96.1158932, 


  // latitude: 21.954482,
  // longitude: 96.083173, 
 
    radius: 500, // Radius in meters
  };

  // Haversine formula to calculate distance between two points
  const isLocationWithinRadius = (lat1, lon1, lat2, lon2, radius) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const earthRadius = 6371000; // Earth's radius in meters

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance <= radius;
  };

  // Check if the user is within the allowed region
  const checkLocation = async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMessage("Location permission is required to use this app.");
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const isWithinRegion = isLocationWithinRadius(
        location.coords.latitude,
        location.coords.longitude,
        predefinedRegion.latitude,
        predefinedRegion.longitude,
        predefinedRegion.radius
      );

      if (isWithinRegion) {
        setIsInAllowedRegion(true);
      } else {
        setErrorMessage("You must be within the allowed area to use this app.");
      }
    } catch (error) {
      setErrorMessage("Failed to fetch your location. Please try again.");
      console.error("Error fetching location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run location check on mount
  useEffect(() => {
    checkLocation();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg">Checking your location...</Text>
      </View>
    );
  }

  if (!isInAllowedRegion) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-5">
        <Text className="text-center text-red-500 text-lg font-bold">
          {errorMessage}
        </Text>
        <TouchableOpacity
          onPress={checkLocation}
          className="mt-5 bg-blue-500 p-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
      <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain"
        />

        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Congratulations on Joining UCS (Mdy)
          </Text>

          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Rollcall Helper {"\n"}
            <Text className="text-primary-300">Your Comfort, Our Priority</Text>
          </Text>


          <TouchableOpacity
            onPress={handleLogin}
            className="bg-white shadow-md shadow-black-300 rounded-full w-full py-2 mt-5"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={images.ucsLogo}
                className="size-14"
                resizeMode="contain"
              />
              <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                  Start using now
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

