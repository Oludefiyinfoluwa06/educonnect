import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { config } from '../../config';

const SignIn = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const router = useRouter();

    const handleInputChange = (field: any, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSignIn = async () => {
        setLoading(true);

        try {
            const response = await axios.post(`${config.BASE_API_URL}/api/auth/login`, formData);
            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('role', response.data.user.role);
            router.replace(response.data.user.role === "Parent" ? "../parent/(tabs)/dashboard" : "../admin/(tabs)/dashboard");
        } catch (error: any) {
            setErrorMessage(error.response.data.message);

            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="h-full w-full flex justify-center px-6">
                <View className="items-center mb-8">
                    <View className="items-center">
                        <LinearGradient
                            colors={['#2563eb', '#60a5fa']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="px-4 py-2 rounded-lg"
                        >
                            <Text className="text-4xl font-rextrabold text-white tracking-wide">
                                EduConnect
                            </Text>
                        </LinearGradient>
                        <View className="flex-row items-center justify-center mt-2">
                            <View className="h-[1px] w-12 bg-blue-600/20" />
                            <Text className="text-blue-600 text-xs mx-2 font-rbold">
                                LEARNING SIMPLIFIED
                            </Text>
                            <View className="h-[1px] w-12 bg-blue-600/20" />
                        </View>
                    </View>
                    <Text className="text-2xl font-rbold text-gray-800 mt-4">Welcome Back!</Text>
                </View>

                {errorMessage && (
                    <View className="bg-red-100 rounded-md px-4 py-3 my-2">
                        <Text className="text-red-600 font-medium text-sm">{errorMessage}</Text>
                    </View>
                )}

                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-700 mb-2 text-sm font-rregular">Email Address</Text>
                        <TextInput
                            placeholder="Enter your email"
                            className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 font-rregular"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                        />
                    </View>

                    <View>
                        <Text className="text-gray-700 mb-2 text-sm font-rregular">Password</Text>
                        <TextInput
                            placeholder="Enter your password"
                            className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 font-rregular"
                            secureTextEntry
                            value={formData.password}
                            onChangeText={(text) => handleInputChange('password', text)}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-blue-600 h-12 rounded-xl items-center justify-center mt-6"
                    onPress={handleSignIn}
                >
                    <Text className="text-white font-rsemibold">{loading ? 'Loading...' : 'Sign In'}</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-8">
                    <Text className="text-gray-600 font-rregular">Don't have an account? </Text>
                    <Link href="/sign-up" className="text-blue-600 font-rsemibold">
                        Sign Up
                    </Link>
                </View>
            </View>
        </View>
    );
}

export default SignIn;
