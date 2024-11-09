import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { config } from '@/config';
import { getToken, logout } from '@/utils';
import axios from 'axios';

interface Student {
    _id: string;
    name: string;
    email: string;
    class: 'JSS 1' | 'JSS 2' | 'JSS 3' | 'SSS 1' | 'SSS 2' | 'SSS 3';
    studentId: string;
    age: number;
    gender: 'male' | 'female';
    guardianName: string;
}

const Profile = () => {
    const [student, setStudent] = useState<Student>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStudent = async () => {
            setLoading(true);
            try {
                const token = await getToken();
                const response = await axios.get(`${config.BASE_API_URL}/api/students`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setStudent(response.data);
            } catch (error: any) {
                if (error.response.data.message) {
                    if (error.response.data.message === "Unauthorized") {
                        await logout();
                    }
                }

                Alert.alert('Error', error.response.data.error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4">
                <View className="items-center py-6">
                    <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-3">
                        <Ionicons name="person" size={48} color="#2563eb" />
                    </View>
                    <Text className="text-xl font-rbold text-gray-800">{student?.name}</Text>
                    <Text className="text-gray-600 font-rregular">{student?.class}</Text>
                    <Text className="text-gray-500 font-rregular">Student ID: {student?.studentId}</Text>
                </View>

                <View className="flex-row flex-wrap justify-between mb-4">
                    <View className="bg-white p-3 rounded-xl w-full mb-3">
                        <Text className="text-gray-600 font-rregular">Age</Text>
                        <Text className="text-lg font-rsemibold text-gray-800">{student?.age} years</Text>
                    </View>
                    <View className="bg-white p-3 rounded-xl w-full mb-3">
                        <Text className="text-gray-600 font-rregular">Gender</Text>
                        <Text className="text-lg font-rsemibold text-gray-800 capitalize">{student?.gender}</Text>
                    </View>
                    <View className="bg-white p-3 rounded-xl w-full mb-3">
                        <Text className="text-gray-600 font-rregular">Parent/Guardian</Text>
                        <Text className="text-lg font-rsemibold text-gray-800">{student?.guardianName}</Text>
                    </View>
                    <View className="bg-white p-3 rounded-xl w-full mb-3">
                        <Text className="text-gray-600 font-rregular">Email</Text>
                        <Text className="text-lg font-rsemibold text-gray-800">{student?.email}</Text>
                    </View>
                </View>

                <View className="w-full mb-[100px]">
                    <TouchableOpacity
                        className="bg-blue-600 p-4 rounded-xl flex-row items-center justify-center"
                        onPress={async () => await logout()}
                    >
                        <Ionicons name="log-out-outline" size={20} color="white" />
                        <Text className="text-white font-rmedium ml-2">Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
