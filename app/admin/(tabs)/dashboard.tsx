import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    return (
        <View className="bg-white p-4 rounded-xl shadow-sm flex-1 mx-2">
            <View className={`w-10 h-10 ${color} rounded-full items-center justify-center mb-2`}>
                <Ionicons name={icon} size={20} color="#2563eb" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">{value}</Text>
            <Text className="text-gray-600 mt-1">{title}</Text>
        </View>
    );
}

interface ActivityItemProps {
    title: string;
    description: string;
    time: string;
    type: 'message' | 'payment' | 'academic';
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
                <Text className="text-gray-800 font-semibold">{title}</Text>
                <Text className="text-gray-600 text-sm">{description}</Text>
            </View>
            <Text className="text-gray-500 text-sm">{time}</Text>
        </View>
    );
}

const Dashboard = () => {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4">
                <View className="flex-row justify-between items-center py-4">
                    <View>
                        <Text className="text-gray-600">Welcome back,</Text>
                        <Text className="text-xl font-bold text-gray-800">Admin</Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                        <Ionicons name="person-outline" size={20} color="#2563eb" />
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                    <StatCard
                        title="Total Students"
                        value="1,234"
                        icon={"people-outline" as keyof typeof Ionicons.glyphMap}
                        color="bg-blue-100"
                    />
                    <StatCard
                        title="Fees Collected"
                        value="₦2.5M"
                        icon={"cash-outline" as keyof typeof Ionicons.glyphMap}
                        color="bg-green-100"
                    />
                    <StatCard
                        title="Messages"
                        value="28"
                        icon={"chatbubbles-outline" as keyof typeof Ionicons.glyphMap}
                        color="bg-yellow-100"
                    />
                </ScrollView>

                <View className="flex-row justify-between mt-6">
                    <TouchableOpacity className="bg-white p-4 rounded-xl shadow-sm flex-1 mr-2">
                        <Ionicons name="add-circle-outline" size={24} color="#2563eb" />
                        <Text className="text-gray-800 font-medium mt-2">Add Student</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-white p-4 rounded-xl shadow-sm flex-1 mx-2">
                        <Ionicons name="megaphone-outline" size={24} color="#2563eb" />
                        <Text className="text-gray-800 font-medium mt-2">Announce</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-6 mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-3">Recent Activity</Text>
                    <View className="bg-white rounded-xl shadow-sm p-4">
                        <ActivityItem
                            title="New Message"
                            description="Parent inquiry about fees"
                            time="2m ago"
                            type="message"
                        />
                        <ActivityItem
                            title="Fee Payment"
                            description="₦150,000 received from John Doe"
                            time="1h ago"
                            type="payment"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Dashboard;