import { Stack } from 'expo-router';

const AdminScreensLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name='profile'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='student'
                options={{ headerShown: false }}
            />
        </Stack>
    );
}

export default AdminScreensLayout;
