
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootStackParamList } from './src/navigation/types';
import WelcomeScreen from './src/screens/WelcomeScreen';

import HomeScreen from './src/screens/HomeScreen';
import SchemeDetailsScreen from './src/screens/SchemeDetailsScreen';
import MyApplicationsScreen from './src/screens/MyApplicationsScreen';

import { LanguageProvider } from './src/context/LanguageContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            {/* LanguageSelectionScreen removed as it is merged into WelcomeScreen */}
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SchemeDetails" component={SchemeDetailsScreen} options={{ headerShown: true, title: 'Scheme Details' }} />
            <Stack.Screen name="MyApplications" component={MyApplicationsScreen} options={{ headerShown: true, title: 'My Applications' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

export default App;
