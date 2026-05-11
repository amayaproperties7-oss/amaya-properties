import { Tabs } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#000000',
        borderTopColor: '#333333',
        height: 60,
        paddingBottom: 8,
      },
      tabBarActiveTintColor: '#D4AF37',
      tabBarInactiveTintColor: '#A1A1A1',
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
      }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'DASHBOARD',
          tabBarIcon: ({ color }) => <IconSymbol name="chart.bar.fill" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="properties"
        options={{
          title: 'PROPERTIES',
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inquiries"
        options={{
          title: 'INQUIRIES',
          tabBarIcon: ({ color }) => <IconSymbol name="envelope.fill" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: 'VISITS',
          tabBarIcon: ({ color }) => <IconSymbol name="calendar" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'MEMBERS',
          tabBarIcon: ({ color }) => <IconSymbol name="person.2.fill" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
