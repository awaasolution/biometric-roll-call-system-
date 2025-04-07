import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useRouter } from "expo-router";
import icons from "@/constants/icons";
import images from "@/constants/images";
import loggedUserStore from "@/stores/userDataStore";
import { SafeAreaView } from "react-native-safe-area-context";



const ChatHeader = ({image}) => (
  <View className="flex-row justify-between items-center bg-white m-2">
    <TouchableOpacity onPress={()=>{router.back()}}>
      <Image source={icons.backArrow} className="size-8" />
    </TouchableOpacity>
    <Text className="font-rubik-bold font-bold text-2xl">Chat</Text>
    <TouchableOpacity>
      <Image source={{uri: image}} className="w-12 h-12 rounded-full" />
    </TouchableOpacity>
  </View>
);

const ChatSearchBar = ({ searchQuery, setSearchQuery }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="flex-row items-center bg-gray-200 p-2 rounded-2xl m-2">
      <Image className="size-5" source={icons.search} />
      <TextInput
        placeholder="Search Users"
        className="flex-1 ml-2 text-gray-700"
        placeholderTextColor={isFocused ? "#3741515A" : "#374151"}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
    </View>
  );
};

const ChatSectionHeader = ({ children }) => (
  <View className="m-2">
    <Text className="text-2xs text-black-200 font-bold">{children}</Text>
  </View>
);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const Contact = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [peopleInCharge, setPeopleInCharge] = useState(null);
  const [classmates, setClassmates] = useState(null);
  const router = useRouter();
    const loggedUserId = loggedUserStore(state=>state.loggedUserData).loggedUserId
    const loggedUserProfileImg = loggedUserStore(state=>state.loggedUserData.loggedUserProfileImg)

    const serverEndPoint = 'http://192.168.24.244:4000'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [peopleInChargeResponse, classmatesResponse] = await Promise.all([
          fetch(`http://192.168.24.244:4000/api/users/listall/admins/${loggedUserId}`),
          fetch(`http://192.168.24.244:4000/api/users/listall/${loggedUserId}`),
        ]);

        setPeopleInCharge(await peopleInChargeResponse.json());
        setClassmates(await classmatesResponse.json());
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (!peopleInCharge || !classmates) {
    // return <Text>Loading...</Text>;
    return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
    )
  }

  const peopleInChargeData = peopleInCharge?.data?.user || [];
  const classmatesData = classmates?.data?.user || [];

  return (
    <SafeAreaView className="h-full bg-white">
      <ChatHeader image={`${serverEndPoint}${loggedUserProfileImg}`}/>
      <ChatSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {!searchQuery ? 
      (
        <>
              <ChatSectionHeader> အဆောင်မှုးနှင့် တာဝန်ရှိသူများ </ChatSectionHeader>
      <View>


      <FlatList
        data={peopleInChargeData}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row justify-start m-2 gap-4"
        bounces={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity className="w-16 h-16" 
            onPress={()=>{
            router.push({
                pathname: `../property/${item.id}`,
                params: {
                  name: item.name,
                  avatar: item.profileImg,
                  userId: item._id,
                },
              })
            }}
          >
            <Image
              // source={{ uri: item.profileImg }}
              
              // source={images.avatar}
              source={{uri: `${serverEndPoint}${item.profileImg}`}}



              className="w-full h-full rounded-full"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      />
      </View>

      <ChatSectionHeader>Your Classmates</ChatSectionHeader>

      <FlatList
        data={classmatesData}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-col justify-start ml-1 gap-2"
        bounces={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center justify-center mt-2"
            onPress={() =>{
            const roomName = [loggedUserId, item.id].sort().join('');
            // socket.emit('message:send', {
            //   name: '67aebbf6513bc79fdbdc47d367aebc05513bc79fdbdc47d5',
            //   senderId: '67aebc05513bc79fdbdc47d5',
            //   receiverId: '67aebbf6513bc79fdbdc47d3',
            //   message: 'Ejej'
            // })
              router.push({
                pathname: `../property/${item.id}`,
                params: {
                  name: item.name,
                  avatar: item.profileImg,
                  userId: item._id,
                },
              })
            }
            }
          >

            <Image source={{uri: `${serverEndPoint}${item.profileImg}`}} className="size-16 rounded-full" />
            {/* <Image source={{ uri: item.profileImg }} className="size-16" /> */}

            <View className="flex-row flex-1 justify-between m-2">
              <View className="flex-col">
                <Text className="font-rubik-bold text-md">{item.name}</Text>
                <Text className="text-xs text-black-200">
                  Message: Hello How are you
                </Text>
              </View>
              <View className="flex-col items-center justify-center gap-1">
                <Text className="text-black-100 text-xs">9:30 PM</Text>
                <View className="bg-primary-300 rounded-full h-5 w-6 flex items-center justify-center">
                  <Text className="w-full h-full text-center text-white text-xs">
                    2
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
        </>
      )
      : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
      )  
    }
    </SafeAreaView>
  );
};

export default Contact;
