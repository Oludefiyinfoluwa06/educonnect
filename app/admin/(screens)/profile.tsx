import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
    return (
        <SafeAreaView>
            <Text>Profile</Text>
            <TouchableOpacity onPress={async () => {
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("role");
                router.replace("/(auth)/sign-in");
            }}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default Profile;
