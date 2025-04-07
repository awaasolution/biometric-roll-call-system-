
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions, ScrollView} from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import images from '@/constants/images'
import loggedUserStore from '@/stores/userDataStore'
import { router } from 'expo-router'




const test = () => {
  const loggedUserProfileImg = loggedUserStore(state=>state.loggedUserData.loggedUserProfileImg)
  const loggedUserName = loggedUserStore(state=>state.loggedUserData.loggedUserName)
  const serverEndPoint = `http://192.168.24.244:4000`
  return (
    <SafeAreaView className='h-full bg-gray-100'>
        <TouchableOpacity className='flex flex-row justify-between items-center mt-2 mb-2 ml-4 mr-4'
          onPress={()=>{
            router.push('/(root)/(tabs)/me')
          }}
        >
            <View className='flex-row justify-center items-center'>
              <Image source={{uri: `${serverEndPoint}${loggedUserProfileImg}`}} className='size-14 rounded-full'/>
              <View className='flex-col m-2 items-start justify-start'>
                <Text className='text-gray-500 text-xs'>
                  Welcome Back
                </Text>
                <Text className='font-rubik-light font-bold'>
                  {loggedUserName}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={()=>{
              router.push('/(root)/contact')
            }}>
                <Image source={icons.chat} className='size-7' tintColor={'#0000FF'}/>
            </TouchableOpacity>
        </TouchableOpacity>
{/* 
        <View className='bg-black m-2 h-48 rounded-lg'>
            
        </View> */}
    
      <View className='flex-col gap-[-2]'>

      <View className='flex-row gap-2 justify-between m-2'>


        <View className='bg-white h-24 w-52 rounded-lg items-start justify-center'>
          <View className='flex-row justify-between gap-16 ml-2 mr-2'>
                    <Text className='font-bold text-xl'>
            University
          </Text>
          <Image source={images.realucs} className='size-9 ml-2 mr-2 justify-center items-center'/>

          </View>
          <Text className='text-gray-500 text-xs m-2'>
            UCS (Mdy)
          </Text>
        </View>


        <View className='bg-white h-24 w-52 rounded-lg items-start justify-center'>
          <View className='flex-row justify-between gap-16 ml-2 mr-2'>
                    <Text className='font-bold text-xl'>
            Campus
          </Text>
          <Image source={images.realucs} className='size-9 ml-2 mr-2 justify-center items-center'/>

          </View>
          <Text className='text-gray-500 text-xs m-2'>
            Ka Naung
          </Text>
        </View>

        
      </View>


      <View className='flex-row gap-2 justify-between m-2'>


        <View className='bg-white h-24 w-52 rounded-lg items-start justify-center'>
          <View className='flex-row justify-between gap-16 ml-2 mr-2'>
                    <Text className='font-bold text-xl'>
            06:00 PM
          </Text>
          <Image source={images.clock} className='size-9 ml-2 mr-2 justify-center items-center'/>

          </View>
          <Text className='text-gray-500 text-xs m-2'>
            Start Time
          </Text>
        </View>

                <View className='bg-white h-24 w-52 rounded-lg items-start justify-center'>
          <View className='flex-row justify-between gap-16 ml-2 mr-2'>
                    <Text className='font-bold text-xl'>
            08:00 PM
          </Text>
          <Image source={images.clock} className='size-9 ml-2 mr-2 justify-center items-center'/>

          </View>
          <Text className='text-gray-500 text-xs m-2'>
            End Time
          </Text>
        </View>
      </View>
      </View>



    <View className='flex-col gap-0'>

        <View className="bg-white rounded-lg p-4 m-2 shadow-md flex-row justify-between items-center">
          <View className="mr-4">
            <Text className="text-lg font-bold">Apply for</Text>
            <Text className="text-sm text-gray-600">Face Recognition Attendance</Text>
            <TouchableOpacity className='bg-blue-500 p-2 w-24 rounded-lg mt-2'
              onPress={
                  ()=>{
                    router.push('/(root)/verifyPhoto')
                  }
              }
            >
              <Text className='text-2xs text-center'>Apply</Text>
            </TouchableOpacity>
          </View>
          <Image source={images.faceReco} className="w-28 h-28 object-contain" />
        </View>
        
        <View className="bg-white rounded-lg p-4 m-2 shadow-md flex-row justify-between items-center">
          <View className="mr-4">
            <Text className="text-lg font-bold">Contact With</Text>
            <Text className="text-sm text-gray-600">Your classmates and people-in-charge</Text>
            <TouchableOpacity className='bg-blue-500 p-2 w-24 rounded-lg mt-2'
              onPress={
                  ()=>{
                    router.push('/(root)/contact')
                  }
              }
            >
              <Text className='text-2xs text-center'>Contact</Text>
            </TouchableOpacity>
          </View>
          <Image source={images.joinFriend} className="w-28 h-28 object-contain" />
        </View>


        <View className="bg-white rounded-lg p-4 m-2 shadow-md flex-row justify-between items-center">
          <View className="mr-4">
            <Text className="text-lg font-bold">Take attendance</Text>
            <Text className="text-sm text-gray-600">within the school range</Text>
            <TouchableOpacity className='bg-blue-500 p-2 w-24 rounded-lg mt-2'
              onPress={
                  ()=>{
                    router.push('/(root)/ReconIntor')
                  }
              }
            
            >
              <Text className='text-2xs text-center'>Mark</Text>
            </TouchableOpacity>
          </View>
          <Image source={images.attendance} className="w-28 h-28 object-contain" />
        </View>
    </View>
    </SafeAreaView>
  )
}
export default test