import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

const CustomAlertBox = ({children}) => {
    const [isVisible, setIsVisible] = useState(false);

    const openAlert = () => setIsVisible(true);
    const closeAlert = () => setIsVisible(false);

    return (
        <View className="flex-1 justify-center items-center bg-gray-100">
            {/* Button to trigger the alert */}
            <TouchableOpacity
                onPress={openAlert}
                className="px-4 py-2 bg-blue-500 rounded-xl"
            >
                <Text className="text-white text-base">Show Alert</Text>
            </TouchableOpacity>

            {/* Custom Alert Modal */}
            <Modal
                transparent={true}
                visible={isVisible}
                animationType="fade"
                onRequestClose={closeAlert}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="w-4/5 bg-white rounded-2xl p-6 shadow-lg">
                        <Text className="text-lg font-semibold text-gray-800 mb-4">
                            App Message
                        </Text>
                        <Text className="text-sm text-gray-600 mb-6">
                            <CustomAlertBox>{children}</CustomAlertBox>
                        </Text>
                        <View className="flex-row justify-end">
                            <TouchableOpacity
                                onPress={closeAlert}
                                className="px-4 py-2 bg-red-500 rounded-xl"
                            >
                                <Text className="text-white text-sm">Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default CustomAlertBox;
