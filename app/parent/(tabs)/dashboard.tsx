import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getToken, logout } from '@/utils';
import axios from 'axios';
import { config } from '@/config';

interface ActivityItemProps {
    title: string;
    description: string;
    time: string;
    type: 'message' | 'payment' | 'academic';
}

interface Announcement {
    _id: string;
    title: string;
    content: string;
    date: string;
    priority: 'high' | 'medium' | 'low';
    createdAt: Date;
}

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

const ActivityItem: React.FC<ActivityItemProps> = ({ title, description, time, type }) => {
    const icons: Record<ActivityItemProps['type'], keyof typeof Ionicons.glyphMap> = {
        message: 'chatbubbles-outline',
        payment: 'wallet-outline',
        academic: 'school-outline',
    } as const;

    return (
        <View className="flex-row items-center py-3 border-b border-gray-100">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                <Ionicons name={icons[type]} size={20} color="#2563eb" />
            </View>
            <View className="flex-1 ml-3">
                <Text className="text-gray-800 font-rsemibold">{title}</Text>
                <Text className="text-gray-600 text-sm font-rregular">{description}</Text>
            </View>
            <Text className="text-gray-500 text-sm font-rregular">{time === new Date().toLocaleDateString() ? 'Today' : time}</Text>
        </View>
    );
}

const Dashboard = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [student, setStudent] = useState<Student>();
    const [loading, setLoading] = useState(false);

    const fetchAnnouncements = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(`${config.BASE_API_URL}/api/announcement`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setAnnouncements(response.data);
        } catch (error: any) {
            if (error.response.data.message) {
                if (error.response.data.message === "Unauthorized") {
                    await logout();
                }
            }

            Alert.alert('Error', error.response.data.error);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

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
                <View className="flex-row justify-between items-center py-4">
                    <View>
                        <Text className="text-gray-600 font-rregular">Welcome back,</Text>
                        <Text className="text-xl font-rbold text-gray-800">{loading ? '...' : student?.guardianName}</Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center" onPress={() => router.push("./profile")}>
                        <Ionicons name="person-outline" size={20} color="#2563eb" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-between mt-4">
                    <TouchableOpacity
                        className="bg-white p-4 rounded-xl shadow-sm flex-1 mr-2 items-center"
                        onPress={() => router.push("./payments")}
                    >
                        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                            <Ionicons name="wallet-outline" size={24} color="#2563eb" />
                        </View>
                        <Text className="text-gray-800 font-rmedium">Pay Fees</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-white p-4 rounded-xl shadow-sm flex-1 ml-2 items-center"
                        onPress={() => router.push("../(screens)/messages")}
                    >
                        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                            <Ionicons name="chatbubbles-outline" size={24} color="#2563eb" />
                        </View>
                        <Text className="text-gray-800 font-rmedium">Message</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-6 mb-6">
                    <Text className="text-lg font-rbold text-gray-800 mb-3">Recent Announcements</Text>
                    <View className="bg-white rounded-xl shadow-sm p-4">
                        {announcements.slice(0, 5).map((announcement) => (
                            <ActivityItem
                                key={announcement._id}
                                title={announcement.title}
                                description={announcement.content}
                                time={new Date(announcement.createdAt).toLocaleDateString()}
                                type="academic"
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Dashboard;
