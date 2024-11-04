import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const SignIn = () => {
    const router = useRouter();

    const handleSignIn = async () => {
        router.push("../admin/dashboard");
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

                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-700 mb-2 text-sm font-rregular">Email Address</Text>
                        <TextInput
                            placeholder="Enter your email"
                            className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 font-rregular"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-700 mb-2 text-sm font-rregular">Password</Text>
                        <TextInput
                            placeholder="Enter your password"
                            className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 font-rregular"
                            secureTextEntry
                        />
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-blue-600 h-12 rounded-xl items-center justify-center mt-6"
                    onPress={handleSignIn}
                >
                    <Text className="text-white font-rsemibold">Sign In</Text>
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
