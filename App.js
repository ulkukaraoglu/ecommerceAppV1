import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HomeScreen from './screen/HomeScreen';
import ProfileScreen from './screen/ProfileScreen';
import LoginScreen from './screen/LoginScreen';
import ProductScreen from './screen/ProductScreen';
import RegisterScreen from './screen/RegisterScreen';
import CardScreen from './screen/CardScreen';
import AddressScreen from './screen/AddressScreen';
import UserSettingScreen from './screen/UserSettingScreen.js';
import { UserProvider, UserContext } from './context/UserContext.js';

function MainScreen() {
  const TabNav = createBottomTabNavigator();

  return (
    <TabNav.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <AntDesign name="home" size={24} color={color} />;
          } else if (route.name === 'Profil') {
            return <Ionicons name="person" size={size} color={color} />;
          } else if (route.name === 'Sepetim') {
            return <MaterialIcons name="shopping-cart" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#0163d2",
        tabBarInactiveTintColor: "black",
        tabBarLabelStyle: {
          fontSize: 14,
          paddingBottom: 4,
          fontWeight: '600',
        },
      })}
    >
      <TabNav.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <TabNav.Screen name="Profil" component={ProfileScreen} options={{ headerShown: false }} />
      <TabNav.Screen name="Sepetim" component={CardScreen} options={{ headerShown: false }} />
    </TabNav.Navigator>
  );
}

const App = () => {
  const Stack = createStackNavigator();

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => { }, []);

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={!isLoggedIn ? "Login" : "MainScreen"}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AddressScreen" component={AddressScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Product" component={ProductScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Card" component={CardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="UserSettingScreen" component={UserSettingScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;

