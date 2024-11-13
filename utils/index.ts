import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    return token;
}

export const getRole = async () => {
    const role = await AsyncStorage.getItem('role');
    return role;
}

export const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("role");
    router.replace("/(auth)/sign-in");
}
