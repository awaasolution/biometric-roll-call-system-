import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';

const ReusableModal = ({
  visible,
  title,
  inputValue,
  onChangeText,
  onClose,
  onSave,
}: {
  visible: boolean;
  title: string;
  inputValue: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onSave?: () => void;
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-6 w-11/12">
          <Text className="text-lg font-bold mb-4">{title}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4"
            placeholder="Enter new value"
            value={inputValue}
            onChangeText={onChangeText}
          />
          <View className="flex-row justify-end space-x-4 gap-4">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-red-500 font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave}>
              <Text className="text-blue-500 font-bold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReusableModal;
