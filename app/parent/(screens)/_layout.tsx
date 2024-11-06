import { Stack } from 'expo-router';

const ParentScreensLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name='messages'
                options={{ headerShown: false }}
            />
        </Stack>
    );
}

export default ParentScreensLayout;
