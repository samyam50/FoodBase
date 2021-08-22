import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import FoodPost from '../screens/FoodPost';

const Stack = createStackNavigator();



export default function AppStack() {

  return (
    
    <Stack.Navigator name="Home" options={{headerShown: false}}  children= {(props) => <HomeScreen {...props} />} >
      <Stack.Screen name="Home" options={{headerShown: false}}  children= {(props) => <HomeScreen {...props} />}/>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="Register" component={RegisterScreen}/>
      <Stack.Screen name="FoodPost" component={FoodPost}/>
    </Stack.Navigator>
  );
}
