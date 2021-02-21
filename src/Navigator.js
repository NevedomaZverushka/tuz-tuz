import React, {useEffect} from 'react';
import {Linking, Platform} from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import FavoriteLocations from './screens/FavoriteLocations';
import {createStackNavigator} from "@react-navigation/stack";

import {useSelector} from "react-redux";

import Auth from './screens/Auth';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Splash from "./screens/Splash";
import Form from "./screens/Form";
import OrderList from "./screens/OrderList";
import OrderFlow from "./screens/OrderFlow";
import StatusScreen from "./screens/StatusScreen";
import Game from "./screens/Game";
import ARNavigator from "./screens/ARNavigator";

const Stack = createStackNavigator();

export default function Navigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={'Auth'}
                screenOptions={{headerShown: false}}
            >
                {/*    {!status && <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}}/>}*/}
                <Stack.Screen component={Splash} name={"Splash"} options={{unmountOnBlur: true}}/>
                <Stack.Screen component={Auth} name={"Auth"} options={{unmountOnBlur: true}}/>
                <Stack.Screen component={Home} name={"Home"} options={{unmountOnBlur: true}}/>
                <Stack.Screen component={Profile} name={"Profile"} options={{unmountOnBlur: true}}/>
                <Stack.Screen component={Form} name={"Form"} options={{unmountOnBlur: true}}/>

                <Stack.Screen component={OrderList} name={"OrderList"} options={{unmountOnBlur: true}}/>
                <Stack.Screen component={OrderFlow} name={"OrderFlow"} options={{unmountOnBlur: true}}/>

                <Stack.Screen component={StatusScreen} name={"StatusScreen"} options={{unmountOnBlur: true}}/>

                <Stack.Screen component={Game} name={"Game"} options={{unmountOnBlur: true}} />

                <Stack.Screen component={FavoriteLocations} name="FavoriteLocations"  options={{headerShown: false}}/>
                <Stack.Screen component={ARNavigator} name="AR"  options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}
