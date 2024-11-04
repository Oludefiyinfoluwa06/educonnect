import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = () => {
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/sign-in");
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center px-4">
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
            </View>
        </SafeAreaView>
    );
}

export default SplashScreen;
