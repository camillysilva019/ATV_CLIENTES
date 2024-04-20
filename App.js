import React from 'react';
import { StyleSheet, Platform} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from "./src/pages/Home";
import NewClient from "./src/pages/NewClient";
import AllClients from './src/pages/AllClients';
import EditClient from './src/pages/EditClient';
import ClientConfig from './src/pages/ClientConfig';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Home'
            component={Home}
            options={{
              title: 'Home',
              headerShown: false
            }}
          />
          <Stack.Screen
            name='NewClient'
            component={NewClient}
            options={{
              title: 'Novo Cliente',
            }}
          />
          <Stack.Screen
            name='AllClients'
            component={AllClients}
            options={{
              title: 'Clientes cadastrados',
            }}
          />
          <Stack.Screen
            name='EditClient'
            component={EditClient}
            options={{
              title: 'Editar cliente',
            }}
          />
          <Stack.Screen
            name='ClientConfig'
            component={ClientConfig}
            options={{
              title: 'Configurações do Cliente',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  androidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
    marginTop: 10
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    gap: 10
  },
  containerScroll: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    gap: 5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonTable: {
    flexDirection: 'row',
    gap: 15
  }
});


