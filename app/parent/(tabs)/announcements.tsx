import { config } from '@/config';
import { getToken, logout } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Announcement {
    _id: string;
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
                <Text className="text-gray-800 font-rsemibold text-lg">{title}</Text>
                <View className={`px-3 py-1 rounded-full ${priorityColors[priority].split(' ')[0]}`}>
                    <Text className={`${priorityColors[priority].split(' ')[1]} font-rmedium capitalize`}>
                        {priority}
                    </Text>
                </View>
            </View>
            <Text className="text-gray-600 mb-2 font-rregular">{content}</Text>
            <Text className="text-gray-500 text-sm font-rregular">Sent {date === new Date().toLocaleDateString() ? 'Today' : `on ${date}`}</Text>
        </View>
    );
}

const EmptyState = () => (
    <View className="flex-1 justify-center items-center py-8">
        <Ionicons name="megaphone-outline" size={64} color="#9CA3AF" />
        <Text className="text-gray-500 font-rmedium text-lg mt-4">No announcements</Text>
        <Text className="text-gray-400 font-rregular text-center mt-2">
            Post announcements by clicking the 'New Announcement' button above
        </Text>
    </View>
);

const Announcements = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const token = await getToken();
                const response = await fetch(`${config.BASE_API_URL}/api/announcement`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                setAnnouncements(data);
            } catch (error: any) {
                if (error.response.data.message) {
                    if (error.response.data.message === "Unauthorized") {
                        await logout();
                    }
                }

                Alert.alert('Error', error.response.data.error);
            }
        };

        fetchAnnouncements();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4">
                <View className="py-4">
                    <Text className="text-xl font-rbold text-gray-800">Announcements</Text>
                    <Text className="text-gray-600 font-rregular">Stay updated with school news</Text>
                </View>

                {announcements.length >= 1 ? announcements.map((announcement) => (
                    <AnnouncementCard key={announcement._id} {...announcement} />
                )) : (
                    <EmptyState />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Announcements;
