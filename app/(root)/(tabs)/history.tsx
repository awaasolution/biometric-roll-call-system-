

import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import images from '@/constants/images'
import loggedUserStore from '@/stores/userDataStore'
import { router } from 'expo-router'
import axios from 'axios'



const history = () => {
  const loggedUserProfileImg = loggedUserStore(state=>state.loggedUserData.loggedUserProfileImg)
  const loggedUserId = loggedUserStore(state=>state.loggedUserData.loggedUserId)
  const loggedUserRollNumber = loggedUserStore(state=>state.loggedUserData.loggedUserRollNumber)
  const [records, setRecords] = useState([])
  useEffect(()=>{
    const getRecordsByUserId = async (userId) => {
    try {
        const response = await axios.get(`http://192.168.24.244:4000/api/records/history/${userId}`);
        console.log('Records:', response.data);
        setRecords(r=>[...r, ...response.data]);
        console.log("there are records", records)

    } catch (error) {
        console.error('Error fetching records:', error.response ? error.response.data : error.message);
    }
};
  getRecordsByUserId(loggedUserId)
  }, [loggedUserId])
  return (
    <SafeAreaView className='bg-white'>
      <View className="flex-row justify-between items-center bg-white ml-2 mr-2 mb-2">
          <TouchableOpacity onPress={()=>{router.back()}}>
            <Image source={icons.backArrow} className="size-8 m-2" />
          </TouchableOpacity>
          <Text className="font-rubik-bold font-bold text-2xl">History</Text>
          <TouchableOpacity>
            <Image source={icons.person} className="w-12 h-12 rounded-full" />
          </TouchableOpacity>
    </View>
       <View className='m-2 bg-blue-200 p-4 rounded-t-lg '>
          <Text className='font-bold mb-5'>Feburary - 2025</Text>
              <View
                className='flex-row justify-between'
              >
                <Text className='text-black-200 text-xs'>Total Records</Text>
                <Text className='text-black-200 text-xs'>Roll Call</Text>
              </View>
              <Text className='text-black-300 text-xs'>{records.length}</Text>
        </View>   


        <ScrollView 
          showsHorizontalScrollIndicator={false}
          contentContainerClassName='ml-2 mr-2 flex-col gap-2'
        >

      
          {
            records.length > 0 ? (
              records.map(record =>(
       <View className='flex-row items-center justify-around border rounded-lg border-gray-300' key={record._id}>
              <Image source={{uri: `http://192.168.24.244:4000${loggedUserProfileImg}`}} className='size-12'/>
                <View className='flex-col'>
                  <Text className='font-bold text-xs text-gray-500'>
                  KPTM-{loggedUserRollNumber}
                  </Text>
                  <Text className='font-bold text-xs text-gray-800'>
                      Date: {record.date}
                  </Text>
                </View>
                <View className='flex-col m-2 gap-2'>
                  <Text className='text-xs font-bold ml-2'>
                    Status
                  </Text>
                  <Text className={`${record.status !== 'absent' ? 'bg-green-600': 'bg-red-600'} text-white rounded-lg text-xs p-2`}>
                    {record.status}
                  </Text>
                </View>
              </View>
              ))
            
            
            ) :
            
            (<></>)
          }
      
      




              

              
        </ScrollView>
    </SafeAreaView>
  )
}

export default history



