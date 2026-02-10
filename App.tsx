
import React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootStackParamList } from './src/navigation/types';
import WelcomeScreen from './src/screens/WelcomeScreen';

import HomeScreen from './src/screens/HomeScreen';
import SchemeDetailsScreen from './src/screens/SchemeDetailsScreen';
import MyApplicationsScreen from './src/screens/MyApplicationsScreen';
import ChatScreen from './src/screens/ChatScreen';
import FloatingChatButton from './src/components/FloatingChatButton';

import { LanguageProvider } from './src/context/LanguageContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const [currentRoute, setCurrentRoute] = React.useState<string | undefined>('Welcome');

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer
          ref={navigationRef}
          onStateChange={() => {
            setCurrentRoute(navigationRef.getCurrentRoute()?.name);
          }}
        >
          <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            {/* LanguageSelectionScreen removed as it is merged into WelcomeScreen */}
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SchemeDetails" component={SchemeDetailsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MyApplications" component={MyApplicationsScreen} options={{ headerShown: true, title: 'My Applications' }} />
          </Stack.Navigator>
          <FloatingChatButton
            visible={currentRoute !== 'Welcome' && currentRoute !== 'Chat'}
            onPress={() => navigationRef.navigate('Chat')}
          />
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

export default App;
