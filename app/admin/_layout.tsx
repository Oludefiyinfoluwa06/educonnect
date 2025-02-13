import { Stack } from 'expo-router';

const AdminLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name='(tabs)'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='(screens)'
                options={{ headerShown: false }}
            />
        </Stack>
    );
}

export default AdminLayout;
