import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import icons from '@/constants/icons'
import { router } from 'expo-router'

const ReconIntor = () => {
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
            </View>
            <View className='flex-col justify-center items-center'>
                <Text className='text-2xl font-semibold'>Face Recognition</Text>
                <Text className='text-center text-gray-400'>Your data will not be stored 
                    for more than 2 days {`\n`}
                    in any server or databases</Text>
            </View>
            <View className='absolute bottom-2 w-full'>
                <TouchableOpacity className='w-full flex-row justify-center items-center h-20 bg-blue-600 rounded-3xl'
                    onPress={()=>{
                        router.replace('/(root)/markattendance')
                    }}
                >
                    <Text className='text-white'>Take attendance</Text>
                </TouchableOpacity>
            </View>
            </View>
        </SafeAreaView>
  )
}
export default ReconIntor