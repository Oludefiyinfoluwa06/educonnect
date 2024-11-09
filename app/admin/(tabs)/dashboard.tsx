import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import { config } from '@/config';
import { getToken, logout } from '@/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

interface DashboardStats {
    totalStudents: number;
    newStudents: number;
    classDistribution: Array<{
        _id: string;
        count: number;
    }>;
    genderDistribution: Array<{
        _id: string;
        count: number;
    }>;
    lastUpdated: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    return (
        <View className="bg-white p-4 rounded-xl shadow-sm flex-1 mx-2">
            <View className={`w-10 h-10 ${color} rounded-full items-center justify-center mb-2`}>
                <Ionicons name={icon} size={20} color="#2563eb" />
            </View>
            <Text className="text-2xl font-rbold text-gray-800">{value}</Text>
            <Text className="text-gray-600 mt-1 font-rregular">{title}</Text>
        </View>
    );
}

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
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await axios.get(`${config.BASE_API_URL}/api/dashboard/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setStats(response.data);
            setError(null);
        } catch (err: any) {
            if (err.response.data.message === "Unauthorized") {
                await logout();
            }
            setError(err.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();

        const interval = setInterval(fetchDashboardStats, 300000);
        return () => clearInterval(interval);
    }, []);

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

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}k`;
        }
        return num.toString();
    };
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4">
                <View className="flex-row justify-between items-center py-4">
                    <View>
                        <Text className="text-gray-600 font-rregular">Welcome back,</Text>
                        <Text className="text-xl font-rbold text-gray-800">Admin</Text>
                    </View>
                    <TouchableOpacity
                        className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center"
                        onPress={() => router.push("../(screens)/profile")}
                    >
                        <Ionicons name="person-outline" size={20} color="#2563eb" />
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                    <StatCard
                        title="Total Students"
                        value={loading ? '...' : formatNumber(stats?.totalStudents || 0)}
                        icon="people-outline"
                        color="bg-blue-100"
                    />
                    <StatCard
                        title="New Students"
                        value={loading ? '...' : formatNumber(stats?.newStudents || 0)}
                        icon="person-add-outline"
                        color="bg-green-100"
                    />
                </ScrollView>

                <View className="flex-row justify-between mt-6">
                    <TouchableOpacity
                        className="bg-white p-4 rounded-xl shadow-sm flex-1 mr-2"
                        onPress={() => router.push("./students")}
                    >
                        <Ionicons name="add-circle-outline" size={24} color="#2563eb" />
                        <Text className="text-gray-800 font-rmedium mt-2">Add Student</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-white p-4 rounded-xl shadow-sm flex-1 mx-2"
                        onPress={() => router.push("./announcements")}
                    >
                        <Ionicons name="megaphone-outline" size={24} color="#2563eb" />
                        <Text className="text-gray-800 font-rmedium mt-2">Announce</Text>
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
};

export default Dashboard;
