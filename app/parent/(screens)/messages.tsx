import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Message {
    id: string;
    content: string;
    timestamp: string;
}

const MessageBubble: React.FC<Message> = ({ content, timestamp }) => (
    <View className="bg-white p-3 rounded-xl shadow-sm mb-3 self-end">
        <Text className="text-gray-800 font-rregular text-right">{content}</Text>
        <Text className="text-gray-500 text-xs font-rregular text-right">{timestamp}</Text>
    </View>
);

const Messages = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Hi, I have a question about the upcoming school event.',
            timestamp: '3:45 PM',
        },
        {
            id: '2',
            content: 'Sure, how can I help you?',
            timestamp: '3:47 PM',
        },
        {
            id: '3',
            content: 'What time does the event start?',
            timestamp: '3:50 PM',
        },
        {
            id: '4',
            content: 'The event starts at 6 PM on Friday, March 22nd.',
            timestamp: '3:52 PM',
        },
    ]);

    const [newMessage, setNewMessage] = useState('');

    const sendMessage = () => {
        if (newMessage.trim() !== '') {
            const newMessageObj: Message = {
                id: `${messages.length + 1}`,
                content: newMessage,
                timestamp: new Date().toLocaleTimeString(),
            };
            setMessages([...messages, newMessageObj]);
            setNewMessage('');
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
                {messages.map((message) => (
                    <MessageBubble key={message.id} {...message} />
                ))}
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
                    <Ionicons name="send-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Messages;
