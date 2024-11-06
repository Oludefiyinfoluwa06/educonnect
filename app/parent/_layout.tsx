import { Stack } from 'expo-router';

const ParentLayout = () => {
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

export default ParentLayout;
