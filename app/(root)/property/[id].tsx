



//   useEffect(() => {
//     requestAnimationFrame(() => {
//       flatListRef.current?.scrollToEnd({ animated: true });
//     });
//   }, [messages]);








//   return (
//     <SafeAreaView className='bg-white h-full'>
//       <View className='flex-row justify-between m-2'>
//         <View className='flex-row items-center'>
//           <TouchableOpacity onPress={() => router.back()}>
//             <Image source={icons.backArrow} className='size-8' />
//           </TouchableOpacity>
//           <View className='flex-row ml-3'>
//             <Image source={images.avatar} className='size-12' />
//             <View className='ml-2 flex-col justify-center'>
//               <Text className='font-rubik-medium text-md'>{name}</Text>
//               <View className='flex-row items-center justify-start'>
//                 <Text className='text-black-200 text-xs self-center'>Active Now</Text>
//                 <View className='w-2 h-2 rounded-full m-2 flex-row items-center justify-center'>
//                   <View className='w-full h-full bg-green-600 rounded-full'></View>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </View>
//         <View className='flex-row items-center gap-2'>
//           <Image source={icons.info} className='size-8 m-3' />
//           <Image source={icons.calendar} className='size-8 mr-3' />
//         </View>
//       </View>
//       <View className='flex-1'>
//         <View className='flex-1'>
//           <FlatList
//             ref={flatListRef}
//             showsVerticalScrollIndicator={false}
//             data={messages}
//             removeClippedSubviews={true} // Improve performance for large lists

//             renderItem={({ item, index }) => {
//               // console.log(item)
//              return  (
//               <Message message={item.message} isSender={item.senderId === loggedUserId} key={index}/>
//             )
//             }}
//             keyExtractor={(item) => item._id}
//             contentContainerStyle={{ padding: 10 }}
//             contentContainerClassName='flex-col gap-1 flex-grow justify-end'
//             getItemLayout={(data, index) => {
//               const message = data[index].message;
//               const charsPerLine = 30;
//               const lines = Math.ceil(message.length / charsPerLine);
//               const heightPerLine = 20;
//               const padding = 20;
//               const messageHeight = lines * heightPerLine + padding;
//               return {
//                 length: messageHeight,
//                 offset: index * messageHeight,
//                 index,
//               };
//             }}
//             onScrollToIndexFailed={(error) => {
//               flatListRef.current?.scrollToOffset({
//                 offset: error.averageItemLength * error.index,
//                 animated: true,
//               });
//             }}
//           />
//         </View>

        
//         <View className="w-full bg-gray-100 p-2 flex-row items-center gap-1">
//           <TouchableOpacity className='m-2'>
//             <Image source={icons.edit} className='size-8' tintColor={'#0000007A'} />
//           </TouchableOpacity>
//           <TextInput
//             placeholder="Type a message"
//             className="flex-1 bg-white p-3 rounded-lg shadow-sm"
//             value={message}
//             onChangeText={handleChange}
//           />
// <TouchableOpacity 
//   className="ml-3 bg-primary-200 p-3 rounded-full" 
//   onPress={async () => {
//     if (message.trim()) {
//       const roomName = [loggedUserId, userId].sort().join(''); // Generate room name
      
//       const messageData = {
//         senderId: loggedUserId,
//         receiverId: userId,
//         name: roomName,
//         message: message,
//       };
      
//       socket.emit("join:room", {roomName})

//       // Update local state for immediate UI feedback
//       console.log(`this is messageData`, messageData)


//       socket.emit("message:send", messageData);



//       try {
//         // Send message to the server
//         await axios.post('http://192.168.152.244:4000/api/messages', messageData);
//       } catch (error) {
//         console.error('Error sending message:', error);
//       }

//       setMessage(''); // Clear the input after sending
//     }
//   }}
// >
//   <Image source={icons.send} className="size-5 tint-white" />
// </TouchableOpacity>

//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ChatScreen;



import React, { useRef, useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  FlatList 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { SafeAreaFrameContext, SafeAreaView } from 'react-native-safe-area-context';
import { io } from 'socket.io-client';
import loggedUserStore from '@/stores/userDataStore';
import Message from '@/components/messageComponent';
import icons from '@/constants/icons';
import images from '@/constants/images';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const SOCKET_ENDPOINT = 'http://192.168.24.244:4000'; // Centralized constant
const serverEndPoint = 'http://192.168.24.244:4000'


const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);
  const socket = useMemo(() => io(SOCKET_ENDPOINT), []); // Prevents multiple socket instances

  const loggedUserData = loggedUserStore((state) => state.loggedUserData);
  const { loggedUserId } = loggedUserData;
  const { avatar, name, userId } = useLocalSearchParams();

  // Room Name Memoization
  const roomName = useMemo(() => [loggedUserId, userId].sort().join(''), [loggedUserId, userId]);

  useEffect(() => {
    // Join Room
    socket.emit('join:room', { roomName });

    return () => {
      // Cleanup on unmount
      socket.emit('leave:room', { roomName });
      socket.disconnect();
    };
  }, [roomName, socket]);

  useEffect(() => {
    // Fetch Messages and Create Room
    const fetchMessages = async () => {
      try {
        const result = await axios.post(`${SOCKET_ENDPOINT}/api/room/`, {
          user1Id: loggedUserId,
          user2Id: userId,
          name: roomName,
        });

        if (result.data.room) {
          const res = await axios.get(`${SOCKET_ENDPOINT}/api/messages/${roomName}`);
          setMessages(res.data.messages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error.response?.data || error.message);
      }
    };

    if (loggedUserId && userId) {
      fetchMessages();
    }
  }, [loggedUserId, userId, roomName]);

  useEffect(() => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages]);



  type messageDataType = {
    _id: string,
    senderId: string, 
    receiverId: string,
    name: string,
    message: string
  }


  useEffect(() => {
    // Handle incoming messages
    const handleMessageReceive = ({ senderId, receiverId, name, message, _id}: messageDataType) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          _id,
          senderId,
          receiverId,
          name,
          message,
        },
      ]);
    };

    socket.on('message:receive', handleMessageReceive);

    return () => {
      socket.off('message:receive', handleMessageReceive);
    };
  }, [socket]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const messageData = {
      senderId: loggedUserId,
      receiverId: userId,
      name: roomName,
      message,
    };



    //create message in database;
    socket.emit('message:send', messageData);
    try {
      await axios.post(`${SOCKET_ENDPOINT}/api/messages`, messageData);
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setMessage(''); // Clear input
  };



  return (
    <SafeAreaView className="bg-white h-full">
      {/* Header */}
      {/* <View className="flex-row justify-between m-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={icons.backArrow} className="size-8" />
        </TouchableOpacity>
        <View className="flex-row ml-3">
          <Image source={{uri: `${serverEndPoint}${avatar}`}} className="size-12" />
          <View className="ml-2">
            <Text className="font-rubik-medium text-md">{name}</Text>
            <View className="flex-row items-center">
              <Text className="text-black-200 text-xs">Active Now</Text>
              <View className="w-2 h-2 bg-green-600 rounded-full m-2"></View>
            </View>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <Image source={icons.info} className="size-8 m-3" />
          <Image source={icons.calendar} className="size-8 mr-3" />
        </View>
      </View> */}


       <View className='flex-row justify-between m-2'>
         <View className='flex-row items-center'>
           <TouchableOpacity onPress={() => router.back()}>
             <Image source={icons.backArrow} className='size-8' />
           </TouchableOpacity>
           <View className='flex-row ml-3'>
          <Image source={{uri: `${serverEndPoint}${avatar}`}} className="size-12 rounded-full border" />
             <View className='ml-2 flex-col justify-center'>
               <Text className='font-rubik-medium text-md'>{name}</Text>
               <View className='flex-row items-center justify-start'>
                 <Text className='text-black-200 text-xs self-center'>Active Now</Text>
                 <View className='w-2 h-2 rounded-full m-2 flex-row items-center justify-center'>
                   <View className='w-full h-full bg-green-600 rounded-full'></View>
                 </View>
               </View>
             </View>
           </View>
         </View>
         <View className='flex-row items-center gap-3 mr-1'>
                <Ionicons
          name="call"
          // size={50}
          color="green"
          // onPress={handlePhoneCall}
          className="bg-green-500 p-4 rounded-full size-11"
        />

                <Ionicons
          name="videocam"
          // size={50}
          color="blue"
          // onPress={handleVideoCall}
          className="bg-blue-500 p-4 rounded-full size-11"
        />
         </View>
       </View>

           <View className='w-full h-px bg-gray-200'
        // style={{ backgroundColor: "#0000001A" }} // Apply the color as background
    /> 

      
      <View className='flex-1'>
        {/* Messages */}
      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => {
            console.log(item._id)
            return (
              <Message
                message={item.message}
                isSender={item.senderId === loggedUserId}
                key={item._id}
              />
            )
          }
        
        }
          keyExtractor={(item, index) => `${item._id}sda`} // Use a fallback unique key
          contentContainerStyle={{ padding: 10 }}
          contentContainerClassName='flex-col gap-1 flex-grow justify-end'
          getItemLayout={(data, index) => {
            const message = data[index].message;
            const charsPerLine = 30;
            const lines = Math.ceil(message.length / charsPerLine);
            const heightPerLine = 20;
            const padding = 20;
            const messageHeight = lines * heightPerLine + padding;
            return {
              length: messageHeight,
              offset: index * messageHeight,
              index,
            };
          }}
          onScrollToIndexFailed={(error) => {
            flatListRef.current?.scrollToOffset({
              offset: error.averageItemLength * error.index,
              animated: true,
            });
          }}
        />
      </View>

      </View>

      {/* Input */}
      <View className="w-full bg-gray-100 p-2 flex-row items-center">
        <TextInput
          placeholder="Type a message"
          className="flex-1 bg-white p-2 rounded-lg shadow-sm"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity className="ml-3 bg-primary-200 p-3 rounded-full" onPress={handleSendMessage}>
          <Image source={icons.send} className="size-5 tint-white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
