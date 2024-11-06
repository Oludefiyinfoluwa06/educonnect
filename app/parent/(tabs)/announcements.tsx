import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string;
    priority: 'high' | 'medium' | 'low';
}

const AnnouncementCard: React.FC<Announcement> = ({ title, content, date, priority }) => {
    const priorityColors = {
        high: 'bg-red-100 text-red-600',
        medium: 'bg-yellow-100 text-yellow-600',
        low: 'bg-green-100 text-green-600',
    };

    return (
        <View className="bg-white p-4 rounded-xl shadow-sm mb-3">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-800 font-semibold text-lg">{title}</Text>
                <View className={`px-3 py-1 rounded-full ${priorityColors[priority].split(' ')[0]}`}>
                    <Text className={`${priorityColors[priority].split(' ')[1]} font-medium capitalize`}>
                        {priority}
                    </Text>
                </View>
            </View>
            <Text className="text-gray-600 mb-2">{content}</Text>
            <Text className="text-gray-500 text-sm">{date}</Text>
        </View>
    );
}

const Announcements = () => {
    const announcements: Announcement[] = [
        {
            id: '1',
            title: 'School Closure Notice',
            content: 'Due to maintenance work, the school will be closed on Friday, March 15th, 2024.',
            date: 'March 10, 2024',
            priority: 'high'
        },
        {
            id: '2',
            title: 'Parent-Teacher Meeting',
            content: 'Annual parent-teacher meeting scheduled for March 20th, 2024. Time slots will be shared soon.',
            date: 'March 8, 2024',
            priority: 'medium'
        },
        {
            id: '3',
            title: 'Sports Day Preparation',
            content: 'Annual sports day will be held on March 25th. Students should come in sports attire.',
            date: 'March 7, 2024',
            priority: 'low'
        }
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4">
                <View className="py-4">
                    <Text className="text-xl font-bold text-gray-800">Announcements</Text>
                    <Text className="text-gray-600">Stay updated with school news</Text>
                </View>

                <View className="flex-row justify-between mb-4">
                    <View className="bg-blue-100 p-3 rounded-xl flex-1 mr-2">
                        <Text className="text-blue-600 font-medium">New</Text>
                        <Text className="text-2xl font-bold text-gray-800">2</Text>
                    </View>
                    <View className="bg-red-100 p-3 rounded-xl flex-1 ml-2">
                        <Text className="text-red-600 font-medium">Important</Text>
                        <Text className="text-2xl font-bold text-gray-800">1</Text>
                    </View>
                </View>

                {announcements.map((announcement) => (
                    <AnnouncementCard key={announcement.id} {...announcement} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Announcements;
