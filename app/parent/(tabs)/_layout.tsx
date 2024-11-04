import { View } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

type TabIconProps = {
  icon: keyof typeof Ionicons.glyphMap;
  focused: boolean;
}

const TabIcon = ({ icon, focused }: TabIconProps) => (
  <View
    className={`
      items-center
      justify-center
      w-[50px]
      h-[50px]
      rounded-full
    `}
  >
    <Ionicons
      name={icon}
      size={focused ? 24 : 22}
      color={focused ? '#2563eb' : '#94a3b8'}
    />
  </View>
);

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 65,
          paddingVertical: 8,
          borderRadius: 25,
          backgroundColor: '#ffffff',
          shadowColor: '#222222',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 8,
        },
      }}
    >
      <Tabs.Screen
        name='dashboard'
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={'home-outline'}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='announcements'
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={'megaphone-outline'}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='payments'
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={'wallet-outline'}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={'person-outline'}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
