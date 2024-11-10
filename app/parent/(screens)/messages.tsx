import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import { config } from '@/config';
import { getToken, logout } from '@/utils';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface Message {
    _id: string;
    content: string;
    timestamp: string;
}

const MessageBubble: React.FC<Message> = ({ content, timestamp }) => (
    <View className="bg-white p-3 rounded-xl shadow-sm mb-3 self-end">
        <Text className="text-gray-800 font-rregular text-lg text-right">{content}</Text>
        <Text className="text-gray-500 text-xs font-rregular text-right">{formatDistanceToNow(parseISO(timestamp), { addSuffix: true })}</Text>
    </View>
);

const EmptyState = () => (
    <View className="flex-1 justify-center items-center py-8">
        <Ionicons name="chatbox-ellipses-outline" size={64} color="#9CA3AF" />
        <Text className="text-gray-500 font-rmedium text-lg mt-4">No messages</Text>
        <Text className="text-gray-400 font-rregular text-center mt-2">
            Make a contribution, ask for support or make a complaint through this feature. Messages will be sent to the school's email
        </Text>
    </View>
);

const Messages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState('');

    const fetchMessages = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(`${config.BASE_API_URL}/api/messages`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessages(response.data.messages);
        } catch (error: any) {
            if (error.response.data.message) {
                if (error.response.data.message === "Unauthorized") {
                    await logout();
                }
            }

            Alert.alert('Error', error.response.data.error);
        }
    }

    useEffect(() => {
        const getMessages = async () => {
            await fetchMessages();
        }

        getMessages();
    }, []);

    const sendMessage = async () => {
        if (newMessage.trim() !== '') {
            setLoading(true);
            try {
                const token = await getToken();
                await axios.post(`${config.BASE_API_URL}/api/messages`, {
                    content: newMessage
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setNewMessage('');
                fetchMessages();
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
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="bg-white shadow-sm">
                <View className="flex-row justify-start items-center px-6 py-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back-outline" size={30} color="#000000" />
                    </TouchableOpacity>
                    <Text className="text-xl font-rbold text-gray-800 ml-3">Messages</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pt-4">
                {messages.length >= 1 ? messages.map((message) => (
                    <MessageBubble key={message._id} {...message} />
                )) : (
                    <EmptyState />
                )}
            </ScrollView>

            <View className="bg-white shadow-sm p-4 flex-row items-center">
                <TextInput
                    className="flex-1 border border-gray-200 rounded-lg p-2 font-rregular"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <TouchableOpacity
                    className={`bg-blue-600 p-3 rounded-lg ml-3 ${newMessage.trim() === '' ? 'opacity-50' : ''}`}
                    onPress={sendMessage}
                    disabled={newMessage.trim() === ''}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Ionicons name = "send-outline" size = { 24 } color = "white" />
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Messages;
