import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { config } from '@/config';
import { getToken, logout } from '@/utils';
import axios from 'axios';
import { router } from 'expo-router';

interface AdminProfile {
    fullName: string;
    email: string;
    phone: string;
}

const Profile = () => {
    const [profile, setProfile] = useState<AdminProfile>({
        fullName: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const response = await axios.get(`${config.BASE_API_URL}/api/auth/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setProfile(response.data);
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

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-4 py-6">
                <View className="flex-row items-center justify-start mb-8">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back-outline" size={30} color={"#000000"} />
                    </TouchableOpacity>
                    <Text className="text-2xl font-rbold text-gray-800 ml-2">Profile</Text>
                </View>

                <View className="bg-white p-6 rounded-xl shadow-sm">
                    <View className="mb-6 items-center">
                        <View className="w-20 h-20 bg-blue-100 rounded-full justify-center items-center mb-3">
                            <Ionicons name="person" size={40} color="#2563EB" />
                        </View>
                        <Text className="text-xl font-rbold text-gray-800">{profile.fullName}</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-600 font-rmedium mb-2">Full Name</Text>
                            <Text className="text-gray-800 font-rbold text-lg">{profile.fullName}</Text>
                        </View>

                        <View>
                            <Text className="text-gray-600 font-rmedium mb-2">Email</Text>
                            <Text className="text-gray-800 font-rbold text-lg">{profile.email}</Text>
                        </View>

                        <View>
                            <Text className="text-gray-600 font-rmedium mb-2">Phone</Text>
                            <Text className="text-gray-800 font-rbold text-lg">{profile.phone}</Text>
                        </View>
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
            </View>
        </SafeAreaView>
    );
};

export default Profile;
