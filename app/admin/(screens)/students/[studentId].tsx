import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Student {
    id: string;
    name: string;
    email: string;
    class: 'JSS 1' | 'JSS 2' | 'JSS 3' | 'SSS 1' | 'SSS 2' | 'SSS 3';
    studentId: string;
    age: number;
    gender: 'male' | 'female';
    guardianName: string;
}

const StudentInformation = () => {
    const student = {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@johnson.com',
        class: 'JSS 2',
        studentId: '2023/001',
        age: 13,
        gender: 'female',
        guardianName: 'Mr. & Mrs. Johnson'
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4">
                <View className="flex-row items-center justify-start mt-3">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back-outline" size={30} color="#000000" />
                    </TouchableOpacity>
                    <Text className="font-rbold text-2xl ml-3">Student Profile</Text>
                </View>
                <View className="items-center py-6">
                    <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-3">
                        <Ionicons name="person" size={48} color="#2563eb" />
                    </View>
                    <Text className="text-xl font-rbold text-gray-800">{student.name}</Text>
                    <Text className="text-gray-600 font-rregular">{student.class}</Text>
                    <Text className="text-gray-500 font-rregular">ID: {student.studentId}</Text>
                </View>

                <View className="flex-row flex-wrap justify-between mb-4">
                    <View className="bg-white p-3 rounded-xl shadow-sm w-[48%] mb-3">
                        <Text className="text-gray-600 font-rregular">Age</Text>
                        <Text className="text-lg font-rsemibold text-gray-800">{student.age} years</Text>
                    </View>
                    <View className="bg-white p-3 rounded-xl shadow-sm w-[48%] mb-3">
                        <Text className="text-gray-600 font-rregular">Gender</Text>
                        <Text className="text-lg font-rsemibold text-gray-800">{student.gender}</Text>
                    </View>
                    <View className="bg-white p-3 rounded-xl shadow-sm w-[48%] mb-3">
                        <Text className="text-gray-600 font-rregular">Parent/Guardian</Text>
                        <Text className="text-lg font-rsemibold text-gray-800">{student.guardianName}</Text>
                    </View>
                    <View className="bg-white p-3 rounded-xl shadow-sm w-[48%] mb-3">
                        <Text className="text-gray-600 font-rregular">Email</Text>
                        <Text className="text-lg font-rsemibold text-gray-800">{student.email}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default StudentInformation;