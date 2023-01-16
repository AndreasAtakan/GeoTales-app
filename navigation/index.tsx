/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
//import { FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName /*,Pressable*/ } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import MenuIcon from '../components/MenuIcon';
import { ModalScreen, NotFoundScreen, MapsScreen, TabTwoScreen } from '../screens/';
import { RootStackParamList, RootDrawerParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' && false ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={DrawerNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const Drawer = createDrawerNavigator<RootDrawerParamList>();

function DrawerNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Drawer.Navigator
      initialRouteName="Maps"
      screenOptions={{headerShown: true, headerLeft: () => <MenuIcon />}}
      drawerContent={(props) => null}>
      <Drawer.Screen
        name="Maps"
        component={MapsScreen}
        options={{
          title: 'My maps'
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={TabTwoScreen}
        options={{
          title: 'Profile'
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={() => null}
        options={{
          title: 'Settings'
        }}
      />
      <Drawer.Screen
        name="About"
        component={() => null}
        options={{
          title: 'About GeoTales'
        }}
      />
      <Drawer.Screen
        name="Legal"
        component={() => null}
        options={{
          title: 'Legal info'
        }}
      />
    </Drawer.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
/*function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}*/
