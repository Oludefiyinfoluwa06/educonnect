import { Stack } from 'expo-router';

const AdminScreensLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name='profile'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='students/[studentId]'
                options={{ headerShown: false }}
            />
        </Stack>
    );
}

export default AdminScreensLayout;
