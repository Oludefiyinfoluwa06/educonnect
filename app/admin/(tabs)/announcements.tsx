import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { config } from '@/config';

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
            <Text className="text-gray-500 text-sm font-rregular">{date}</Text>
        </View>
    );
}

const Announcements = () => {
    const [showNewForm, setShowNewForm] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`${config.BASE_API_URL}/api/announcement`);
                const data = await response.json();
                setAnnouncements(data);
            } catch (error: any) {
                console.log('Error fetching announcements:', error.response.data);
            }
        };

        fetchAnnouncements();
    }, []);

    const handleCreateAnnouncement = async () => {
        try {
            const response = await fetch(`${config.BASE_API_URL}/announcements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content,
                    priority,
                }),
            });
            const newAnnouncement = await response.json();
            setAnnouncements([...announcements, newAnnouncement]);
            setShowNewForm(false);
            setTitle('');
            setContent('');
            setPriority('medium');
        } catch (error: any) {
            console.log('Error creating announcement:', error.response.data);
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4">
                <View className="flex-row justify-between items-center py-4">
                    <Text className="text-xl font-rbold text-gray-800">Announcements</Text>
                    <TouchableOpacity
                        className="bg-blue-600 px-4 py-2 rounded-full"
                        onPress={() => setShowNewForm(!showNewForm)}
                    >
                        <Text className="text-white font-rmedium">{showNewForm ? 'Close Announcement Form' : 'New Announcement'}</Text>
                    </TouchableOpacity>
                </View>

                {showNewForm && (
                    <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
                        <TextInput
                            className="border border-gray-200 rounded-lg p-2 mb-3 font-rregular"
                            placeholder="Announcement Title"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            className="border border-gray-200 rounded-lg p-2 mb-3 font-rregular"
                            placeholder="Announcement Content"
                            multiline
                            numberOfLines={4}
                            value={content}
                            onChangeText={setContent}
                            style={{ textAlignVertical:"top" }}
                        />
                        <View className="flex-row mb-4">
                            {(['low', 'medium', 'high'] as const).map((p) => (
                                <TouchableOpacity
                                    key={p}
                                    className={`mr-2 px-4 py-2 rounded-full ${priority === p ? 'bg-blue-600' : 'bg-gray-200'}`}
                                    onPress={() => setPriority(p)}
                                >
                                    <Text className={`font-rmedium capitalize ${priority === p ? 'text-white' : 'text-gray-600'}`}>
                                        {p}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            className="bg-blue-600 p-3 rounded-lg"
                            onPress={handleCreateAnnouncement}
                        >
                            <Text className="text-white font-rmedium text-center">Post Announcement</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {announcements.map((announcement) => (
                    <AnnouncementCard key={announcement._id} {...announcement} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default Announcements;
