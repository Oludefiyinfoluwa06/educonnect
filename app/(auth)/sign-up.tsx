import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { config } from '../../config';

const SignUp = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isParent, setIsParent] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        childName: '',
        studentId: '',
        role: 'Parent',
    });
    const router = useRouter();

    const handleInputChange = (field: any, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSignUp = async () => {
        setLoading(true);

        try {
            const response = await axios.post(`${config.BASE_API_URL}/api/auth/register`, formData);
            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('role', response.data.user.role);
            router.replace(isParent ? "../parent/(tabs)/dashboard" : "../admin/(tabs)/dashboard");
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message);

            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="py-6"
                showsVerticalScrollIndicator={false}
            >
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
                                    Wincoln
                                </Text>
                            </LinearGradient>
                            <View className="flex-row items-center justify-center mt-2">
                                <View className="h-[1px] w-12 bg-blue-600/20" />
                                <Text className="text-blue-600 text-xs mx-2 font-rbold">
                                    BRIDGE
                                </Text>
                                <View className="h-[1px] w-12 bg-blue-600/20" />
                            </View>
                        </View>
                        <Text className="text-2xl font-rbold text-gray-800 mt-4">Create Account</Text>
                    </View>

                    <View className="flex-row space-x-4 mb-6">
                        <TouchableOpacity
                            className={`flex-1 h-12 rounded-xl items-center justify-center ${
                                isParent ? 'bg-blue-600' : 'bg-gray-100'
                            }`}
                            onPress={() => {
                                setIsParent(true);
                                setFormData({ ...formData, role: 'Parent' });
                            }}
                        >
                            <Text className={`font-rsemibold ${
                                isParent ? 'text-white' : 'text-gray-600'
                            }`}>Parent</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 h-12 rounded-xl items-center justify-center ${
                                isParent? 'bg-gray-100' : 'bg-blue-600'
                            }`}
                            onPress={() => {
                                setIsParent(false);
                                setFormData({ ...formData, role: 'Admin' });
                            }}
                        >
                            <Text className={`font-rsemibold ${
                                isParent ? 'text-gray-600' : 'text-white'
                            }`}>Admin</Text>
                        </TouchableOpacity>
                    </View>

                    {errorMessage && (
                        <View className="bg-red-100 rounded-md px-4 py-3 my-2">
                            <Text className="text-red-600 font-medium text-sm">{errorMessage}</Text>
                        </View>
                    )}

                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-700 mb-2 text-sm font-rregular">Full Name</Text>
                            <TextInput
                                placeholder="Enter your full name"
                                className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 font-rregular"
                                autoCapitalize="words"
                                value={formData.fullName}
                                onChangeText={(text) => handleInputChange('fullName', text)}
                            />
                        </View>

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
                            <Text className="text-gray-700 mb-2 text-sm font-rregular">Phone Number</Text>
                            <TextInput
                                placeholder="Enter your phone number"
                                className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 font-rregular"
                                keyboardType="phone-pad"
                                value={formData.phone}
                                onChangeText={(text) => handleInputChange('phone', text)}
                            />
                        </View>

                        {isParent ? (
                            <>
                                <View>
                                    <Text className="text-gray-700 mb-2 mt-3 text-sm font-rregular">Child's Full Name</Text>
                                    <TextInput
                                        placeholder="Enter your child's name"
                                        className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 font-rregular"
                                        autoCapitalize="words"
                                        value={formData.childName}
                                        onChangeText={(text) => handleInputChange('childName', text)}
                                    />
                                </View>
                                <View>
                                    <Text className="text-gray-700 mb-2 mt-3 text-sm font-rregular">Student ID</Text>
                                    <TextInput
                                        placeholder="Enter your child's Student ID"
                                        className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 font-rregular"
                                        value={formData.studentId}
                                        onChangeText={(text) => handleInputChange('studentId', text)}
                                    />
                                </View>
                            </>
                        ) : null}

                        <View>
                            <Text className="text-gray-700 mb-2 text-sm font-rregular">Password</Text>
                            <TextInput
                                placeholder="Create a password"
                                className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 font-rregular"
                                secureTextEntry
                                value={formData.password}
                                onChangeText={(text) => handleInputChange('password', text)}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-blue-600 h-12 rounded-xl items-center justify-center mt-6"
                        onPress={handleSignUp}
                    >
                        <Text className="text-white font-rsemibold">{loading ? 'Loading...' : 'Create Account'}</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-gray-600 font-rregular">Already have an account? </Text>
                        <Link href="/sign-in" className="text-blue-600 font-rsemibold">
                            Sign In
                        </Link>
                    </View>

                    <View className='mt-[40px]' />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SignUp;
