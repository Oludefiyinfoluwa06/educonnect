import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type FeeCardProps = {
    title: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'pending' | 'overdue';
}

const FeeCard: React.FC<FeeCardProps> = ({ title, amount, dueDate, status }) => {
    const statusColors = {
        paid: 'bg-green-100 text-green-600',
        pending: 'bg-yellow-100 text-yellow-600',
        overdue: 'bg-red-100 text-red-600',
    };

    return (
        <View className="bg-white p-4 rounded-xl shadow-sm mb-3">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-800 font-rsemibold text-lg">{title}</Text>
                <View className={`px-3 py-1 rounded-full ${statusColors[status].split(' ')[0]}`}>
                    <Text className={`${statusColors[status].split(' ')[1]} font-rmedium capitalize`}>
                        {status}
                    </Text>
                </View>
            </View>
            <Text className="text-2xl font-rbold text-blue-600">₦{amount.toLocaleString()}</Text>
            <Text className="text-gray-500 mt-1 font-rregular">Due: {dueDate}</Text>
        </View>
    );
}

const Dashboard = () => {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4">
                <View className="flex-row justify-between items-center py-4">
                    <View>
                        <Text className="text-gray-600 font-rregular">Welcome back,</Text>
                        <Text className="text-xl font-rbold text-gray-800">John Doe</Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center" onPress={() => router.push("./profile")}>
                        <Ionicons name="person-outline" size={20} color="#2563eb" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-between mt-4">
                    <TouchableOpacity className="bg-white p-4 rounded-xl shadow-sm flex-1 mr-2 items-center">
                        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                            <Ionicons name="wallet-outline" size={24} color="#2563eb" />
                        </View>
                        <Text className="text-gray-800 font-rmedium">Pay Fees</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-white p-4 rounded-xl shadow-sm flex-1 ml-2 items-center">
                        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                            <Ionicons name="chatbubbles-outline" size={24} color="#2563eb" />
                        </View>
                        <Text className="text-gray-800 font-rmedium">Message</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-6 mb-[100px]">
                    <Text className="text-lg font-bold text-gray-800 mb-3">Recent Fees</Text>
                    <FeeCard
                        title="First Term Fees"
                        amount={150000}
                        dueDate="March 15, 2024"
                        status="pending"
                    />
                    <FeeCard
                        title="Books and Materials"
                        amount={25000}
                        dueDate="February 28, 2024"
                        status="paid"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Dashboard;
