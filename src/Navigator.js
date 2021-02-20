import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import FavoriteLocations from './screens/FavoriteLocations';
import ARNavigator from "./screens/ARNavigator";
import {createStackNavigator} from "@react-navigation/stack";
import {useSelector} from "react-redux";


import Auth from './screens/Auth';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Splash from "./screens/Splash";

const Stack = createStackNavigator();

export default function Navigator() {
    const status = useSelector(state => state.appReady);
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={'Home'}
                screenOptions={{headerShown: false}}
            >
                {/*    {!status && <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}}/>}*/}
                <Stack.Screen component={Splash} name={"Splash"} options={{unmountOnBlur: true}}/>
                <Stack.Screen component={Auth} name={"Auth"} options={{unmountOnBlur: true}}/>
                <Stack.Screen component={Home} name={"Home"} options={{unmountOnBlur: true}}/>
                <Stack.Screen component={Profile} name={"Profile"} options={{unmountOnBlur: true}}/>

                <Stack.Screen component={FavoriteLocations} name="FavoriteLocations"  options={{headerShown: false}}/>
                <Stack.Screen component={ARNavigator} name="AR"  options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}
