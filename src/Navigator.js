import React, {useEffect} from 'react';
import {Linking, Platform} from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import FavoriteLocations from './screens/FavoriteLocations';
import {createStackNavigator} from "@react-navigation/stack";
import {useSelector} from "react-redux";

import Auth from './screens/Auth';
import Home from './screens/Home';
import Profile from './screens/Profile';
import CreateNote from './screens/CreateNote';
import NoteView from './screens/NoteView';
import Verification from './screens/Verification';
import Splash from "./screens/Splash";
import ARNavigator from "./screens/ARNavigator";

const Stack = createStackNavigator();

export default function Navigator() {

    // useEffect(() => {
    //     Linking.getInitialURL().then(url => {
    //         navigateHandler(url);
    //     });
    //     if (Platform.OS === 'ios') {
    //         Linking.addEventListener('url', handleOpenURL);
    //     }
    //     return () => {
    //         if (Platform.OS === 'ios') {
    //             Linking.removeEventListener('url', handleOpenURL);
    //         }
    //     };
    // }, []);
    //
    // const handleOpenURL = (event) => {
    //     navigateHandler(event.url);
    // };
    //
    // const navigateHandler = async (url) => {
    //     if (url) {
    //         //const { navigate } = navigation;
    //         const route = url.replace(/.*?:\/\//g, '');
    //         const id = route.match(/\/([^\/]+)\/?$/)[1];
    //         // const post = posts.find(item => item.id == id);
    //         // navigate('Post', { post: post });
    //     }
    //     console.log('URL', url);
    // };

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={'Splash'}
                screenOptions={{headerShown: false}}
            >
                {/*    {!status && <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}}/>}*/}
                <Stack.Screen component={Splash} name={"Splash"} options={{unmountOnBlur: true}}/>
                <Stack.Screen component={Auth} name={"Auth"} options={{unmountOnBlur: true}}/>
                <Stack.Screen component={Verification} name={"Verification"} options={{unmountOnBlur: true}}/>
                <Stack.Screen component={Home} name={"Home"} options={{unmountOnBlur: true}}/>
                <Stack.Screen component={Profile} name={"Profile"} options={{unmountOnBlur: true}}/>
                <Stack.Screen component={CreateNote} name={"CreateNote"} options={{unmountOnBlur: true}}/>
                <Stack.Screen component={NoteView} name={"NoteView"} options={{unmountOnBlur: true}}/>

                <Stack.Screen component={FavoriteLocations} name="FavoriteLocations"  options={{headerShown: false}}/>
                <Stack.Screen component={ARNavigator} name="AR"  options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}
