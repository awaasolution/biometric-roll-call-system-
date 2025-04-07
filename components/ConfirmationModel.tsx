import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

const ConfirmationModal = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-6 w-11/12">
          <Text className="text-lg font-bold mb-4">{title}</Text>
          <Text className="text-base mb-6">{message}</Text>
          <View className="flex-row justify-end space-x-4 gap-4">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-500 font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm}>
              <Text className="text-red-500 font-bold">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
