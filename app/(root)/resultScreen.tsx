import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";


export default function ResultScreen() {

  const serverEndPoint = `http://192.168.24.244:4000`
  // Catch the parameters using useLocalSearchParams
  const { status, is_match, loggedUserId } = useLocalSearchParams();
  useEffect(() => {
    if (is_match === "true") {
      const createRecord = async () => {
        try {
          console.log(`http://192.168.24.244:4000/api/records/mark/${loggedUserId}`);
          const response = await fetch(
            `http://192.168.24.244:4000/api/records/mark/${loggedUserId}`,
            {
              method: "POST"
            }
          );
          if (response.ok) {
            console.log("Attendance marked successfully.");
          } else {
            console.error("Failed to mark attendance.", await response.text());
          }
        } catch (error) {
          console.error("Error in marking attendance:", error);
        }
      };

      createRecord();
    }
  }, [is_match, loggedUserId]); // Dependency array ensures this runs when is_match or loggedUserId changes


  return (
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
                  {
                    is_match == 'true' ? (
                        <Ionicons name="checkmark-circle" size={80} color="green" className="text-center" />
                    ) : (
                            <Ionicons name="close-circle" size={80} color="red" className="text-center"/>

                    )
                  }
            </View>
            <View className='flex-col justify-center items-center mt-12'>
              {
                is_match=='true' ? (
                                  <Text className='text-center text-green-500'>Attendance Marked</Text>
                ):
                (                <Text className='text-center text-red-500'>Attendance Failed</Text>
)
              }
            </View>

            <View className='absolute bottom-2 w-full'>
                <TouchableOpacity className='w-full flex-row justify-center items-center h-20 bg-blue-600 rounded-3xl'
                    onPress={()=>{
                        router.replace('/(root)/(tabs)/')
                    }}
                >
                    <Text className='text-white'>Go Home</Text>
                </TouchableOpacity>
            </View>
            </View>
        </SafeAreaView>
  );
}
