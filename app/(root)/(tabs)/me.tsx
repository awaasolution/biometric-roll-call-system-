import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import loggedUserStore from '@/stores/userDataStore';
import ReusableModal from '@/components/ReusableModel';
import ConfirmationModal from '@/components/ConfirmationModel';
import axios from 'axios';
import { router } from 'expo-router';


const HorizonalLineComponent = () => <View className="w-full h-px bg-gray-100" />;

const PersonalData = ({ name, value, onPress }: { name: string; value: string; onPress?: () => void }) => (
  <>
    <TouchableOpacity className="flex-row justify-between m-2 p-2" onPress={onPress}>
      <Text className="text-2xs font-bold text-black-300">{name}</Text>
      <View className="flex-row items-center">
        <Text className="text-black-100">{value}</Text>
        <Image source={icons.rightArrow} className="size-5" tintColor={"#00000080"} resizeMode="contain" />
      </View>
    </TouchableOpacity>
    <HorizonalLineComponent />
  </>
);

const me = () => {
  const serverEndPoint = 'http://192.168.24.244:4000';
  const loggedUserData = loggedUserStore((state) => state.loggedUserData);
  const setLoggedUserEmail = loggedUserStore((state) => state.setLoggedUserEmail);
  const setLoggedUserPhoneNumber = loggedUserStore((state) => state.setLoggedUserPhoneNumber);
  const setLoggedUserRollNumber = loggedUserStore((state) => state.setLoggedUserRollNumber);
  const setLoggedUserName = loggedUserStore((state) => state.setLoggedUserName);


  const [textModalVisible, setTextModalVisible] = useState(false);
  const [textModalTitle, setTextModalTitle] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [onTextModalSave, setOnTextModalSave] = useState<(() => void) | undefined>(undefined);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState('');
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | undefined>(undefined);

  const toggleTextModal = () => setTextModalVisible(!textModalVisible);
  const toggleConfirmModal = () => setConfirmModalVisible(!confirmModalVisible);

  const handleEdit = (title: string, currentValue: string, onSave: (newValue: string) => void) => {
    setTextModalTitle(title);
    setInputValue(currentValue);
    setOnTextModalSave(() => () => {
      onSave(inputValue);
      toggleTextModal();
    });
    toggleTextModal();
  };

  const handleConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModalTitle(title);
    setConfirmModalMessage(message);
    setOnConfirmAction(() => () => {
      onConfirm();
      toggleConfirmModal();
    });
    toggleConfirmModal();
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#FFFFFF66",
      }}
      className="h-full"
    >
      <View className="flex-row justify-between items-center ml-4 mr-4 mt-2">
        <TouchableOpacity onPress={()=>{
          router.push('/(root)/(tabs)');
        }}>
        <Image source={icons.backArrow} className="size-8" />

        </TouchableOpacity>
        <Text className="text-black-300 font-bold text-xl">Account</Text>
        <Image source={icons.bell} className="size-8" />
      </View>
      <View className="flex-row justify-center rounded-full mt-8 mb-7 relative">
        <Image
          source={{ uri: `${serverEndPoint}${loggedUserData.loggedUserProfileImg}` }}
          className="size-20 rounded-full"
          resizeMode="contain"
        />
        <TouchableOpacity className="absolute bottom-0 right-[150px]">
          <Image source={icons.edit} className="size-7" />
        </TouchableOpacity>
      </View>
{/* //       User personal data info */}      
        <View>
          <Text className="ml-6 mt-3 mb-[-5] text-gray-500 text-[13px] uppercase">Personal Information</Text>
          <View className="m-3 bg-white rounded-lg border border-white/40 blur-lg -z-10">
            <PersonalData
              name="Name"
              value={loggedUserData.loggedUserName}
              onPress={() =>
                handleEdit('Edit Name', loggedUserData.loggedUserName,  (newValue) => (
                  console.log(newValue)
                )
                )
              }
            />
            <PersonalData
              name="RollNumber"
              value={loggedUserData.loggedUserRollNumber}
              onPress={() =>
                handleEdit('Edit Roll Number', loggedUserData.loggedUserRollNumber, (newValue) =>
                  console.log('Save Roll Number:', newValue)
                )
              }
            />
            <PersonalData
              name="Phone"
              value={loggedUserData.loggedUserPhoneNumber}
              onPress={() =>
                handleEdit('Edit Phone Number', loggedUserData.loggedUserPhoneNumber, (newValue) =>
                  console.log('Save Phone Number:', newValue)
                )
              }
            />
            <PersonalData
              name="Email"
              value={loggedUserData.loggedUserEmail}
              onPress={() =>
                handleEdit('Edit Email', loggedUserData.loggedUserEmail, (newValue) =>
                  console.log('Save Email:', newValue)
                )
              }
            />
            <PersonalData
              name="University"
              value="UCSMDY"
              onPress={() =>
                handleEdit('Edit University', 'UCSMDY', (newValue) =>
                  console.log('Save University:', newValue)
                )
              }
            />
          </View>
        </View>

        <View>
          <Text className="ml-6 mt-3 mb-[-5] text-gray-500 text-[13px] uppercase">Login Information</Text>
          <View className="m-3 bg-white rounded-lg">
            <PersonalData
              name="Email"
              value={loggedUserData.loggedUserEmail}
              onPress={() =>
                handleEdit('Edit Email', loggedUserData.loggedUserEmail, (newValue) =>
                  console.log('Save Email:', newValue)
                )
              }
            />
            <PersonalData
              name="Update Password"
              value=""
              onPress={() =>
                handleEdit('Edit Password', '' , (newValue) =>
                  console.log('Save Phone Number:', newValue)
                )
              }          />
          </View>
        </View>

      <View className="m-2 bg-white">
        <TouchableOpacity className="flex-row justify-between m-2 p-2" onPress={()=>{
          router.replace('/login')
        }}>
          <Text className="text-2xs font-bold text-black-300">Logout</Text>
          <View className="flex-row items-center">
            <Text className="text-black-100"></Text>
            <Image source={icons.logout} className="size-5" tintColor={"#00000080"} resizeMode="contain" />
          </View>
        </TouchableOpacity>
        <HorizonalLineComponent />
        <TouchableOpacity
          className="flex-row justify-between m-2 p-2"
          onPress={() =>
            handleConfirm('Delete Account', 'Are you sure you want to delete your account?', () =>
              router.replace('/login')
            )
          }
        >
          <Text className="text-2xs font-bold text-black-300 text-danger">Delete Account</Text>
        </TouchableOpacity>
        <HorizonalLineComponent />
      </View>

      {/* Reusable TextInput Modal */}
      <ReusableModal
        visible={textModalVisible}
        title={textModalTitle}
        inputValue={inputValue}
        onChangeText={setInputValue}
        onClose={toggleTextModal}
        onSave={onTextModalSave}
      />

      {/* Reusable Confirmation Modal */}
      <ConfirmationModal
        visible={confirmModalVisible}
        title={confirmModalTitle}
        message={confirmModalMessage}
        onClose={toggleConfirmModal}
        onConfirm={onConfirmAction}
      />
    </SafeAreaView>
  );
};

export default me;

