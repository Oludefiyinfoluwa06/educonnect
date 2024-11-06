import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const Profile = () => {
    const studentData = {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@johnson.com',
        class: 'JSS 2',
        studentId: '2023/001',
        age: 13,
        gender: 'female',
        guardianName: 'Mr. & Mrs. Johnson'
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4">
                <View className="items-center py-6">
                    <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-3">
                        <Ionicons name="person" size={48} color="#2563eb" />
                    </View>
                    <Text className="text-xl font-rbold text-gray-800">{studentData.name}</Text>
                    <Text className="text-gray-600 font-rregular">{studentData.class}</Text>
                    <Text className="text-gray-500 font-rregular">Student ID: {studentData.studentId}</Text>
                </View>

                <View className="flex-row flex-wrap justify-between mb-4">
                    <View className="bg-white p-3 rounded-xl shadow-sm w-[48%] mb-3">
                        <Text className="text-gray-600 font-rregular">Age</Text>
                        <Text className="text-lg font-rsemibold text-gray-800">{studentData.age} years</Text>
                    </View>
                    <View className="bg-white p-3 rounded-xl shadow-sm w-[48%] mb-3">
                        <Text className="text-gray-600 font-rregular">Gender</Text>
                        <Text className="text-lg font-rsemibold text-gray-800 capitalize">{studentData.gender}</Text>
                    </View>
                    <View className="bg-white p-3 rounded-xl shadow-sm w-[48%] mb-3">
                        <Text className="text-gray-600 font-rregular">Parent/Guardian</Text>
                        <Text className="text-lg font-rsemibold text-gray-800">{studentData.guardianName}</Text>
                    </View>
                    <View className="bg-white p-3 rounded-xl shadow-sm w-[48%] mb-3">
                        <Text className="text-gray-600 font-rregular">Email</Text>
                        <Text className="text-lg font-rsemibold text-gray-800">{studentData.email}</Text>
                    </View>
                </View>

                <View className="w-full mb-[100px]">
                    <TouchableOpacity
                        className="bg-blue-600 p-4 rounded-xl shadow-sm flex-1 mr-2"
                        onPress={async () => {
                            await AsyncStorage.removeItem("token");
                            await AsyncStorage.removeItem("role");
                            router.replace("/(auth)/sign-in");
                        }}
                    >
                        <View className="flex-row items-center justify-center">
                            <Ionicons name="log-out-outline" size={20} color="white" />
                            <Text className="text-white font-rmedium ml-2">Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
