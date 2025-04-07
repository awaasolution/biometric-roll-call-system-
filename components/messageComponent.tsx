import { View, Text } from "react-native";

const Message = ({ message, isSender }: {message: string, isSender: boolean}) => {
  return (
    <View className={`flex-row items-end ${isSender ? "self-end" : "self-start"}`}>
      {!isSender && (
        <View
          className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-gray-300"
          style={{ marginRight: -5 }}
        />
      )}
      <View
        className={`p-2 max-w-[75%] ${
          isSender ? "bg-blue-500" : "bg-gray-300"
        } rounded-tl-[20px] rounded-tr-[20px] ${
          isSender ? "rounded-br-[9px] rounded-bl-[20px]" : "rounded-br-[20px] rounded-bl-[9px]"
        }`}
      >
        <Text className={`${isSender ? "text-white" : "text-black"} text-base`}>
          {message}
        </Text>
      </View>
      {isSender && (
        <View
          className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-blue-500"
          style={{ marginLeft: -5 }}
        />
      )}
    </View>
  );
};


export default Message;