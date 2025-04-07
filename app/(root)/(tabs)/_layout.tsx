import { Tabs } from "expo-router";
import {View, Text, Image, ImageSourcePropType } from "react-native"
import React from "react";
import icons from "@/constants/icons"
import iconSet from "@expo/vector-icons/build/FontAwesome6";

interface TabBarIconProps{
  focused: boolean,
  title: string,
  icon: ImageSourcePropType
}

const TabBarIcon = ({ focused, title, icon }: TabBarIconProps) => (
  <View className="flex-col flex-auto justify-center items-center mt-3">
    <Image 
      source={icon} 
      className='size-6'
      tintColor={focused ? "#0061FF" : "#666876"}
      resizeMode="contain" 
    />
    <Text className="text-xs text-center w-full font-rubik mt-1 mb-3">
      {title}
    </Text>
  </View>
);


const TabsLayout = () => {
  return (
        <Tabs
          screenOptions={
            {
              tabBarShowLabel: false,
              headerShown: false, 
              tabBarStyle: {
                minHeight: 50,
                borderTopWidth: 1,
              borderTopColor: '#ffffff'
              }
            }
          }
        >
            <Tabs.Screen
              name = "history"
              options={
                {
                  tabBarIcon: ({focused})=>(
                    <TabBarIcon title="History" icon={icons.search} focused={focused}/>
                  )
                }
              }
            />

            <Tabs.Screen
              name = "index"
              options={
                {
                  tabBarIcon: ({focused})=>(
                    <TabBarIcon title="Home" icon={icons.home} focused={focused}/>
                  )
                }
              }
            />

            <Tabs.Screen
              name="me"
              options={
                {
                  tabBarShowLabel: false,
                  headerShown: false,
                  tabBarIcon: ({focused})=>(
                    <TabBarIcon focused={focused} icon={icons.person} title="Profile"/>
                  )
                }
              }
            />
        </Tabs>
  )
}

export default TabsLayout