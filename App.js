import React from 'react';
import {StatusBar, PermissionsAndroid} from 'react-native';

import {Provider, useDispatch, useSelector} from 'react-redux';
import {store, setAction} from "./src/store";

import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Navigator from "./src/Navigator";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import {Spinner, ToastView} from './src/components';

let locationWatch = null;

function AppRoot() {
    const dispatch = useDispatch();
    const spinner = useSelector(state => state.spinner);

    const configureLocation = async () => {
        dispatch(setAction('spinner', true));
        // Request permission
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Geolocation permission",
                message:
                    "We need to know your accurate location to perform the best. Please allow!",
                buttonNegative: "Cancel",
                buttonPositive: "Allow"
            });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            const setLocationWatch = () => {
                if (locationWatch) {
                    clearInterval(locationWatch);
                }
                locationWatch = setInterval(() => {
                    Geolocation.getCurrentPosition((info) => {
                            const {longitude, latitude} = info.coords;
                            dispatch(setAction('location', {lat: latitude, lng: longitude}));
                            dispatch(setAction('app'));
                            dispatch(setAction('spinner', false));
                        }, askGPS,
                        {
                            timeout: 10000,
                            maximumAge: 15000,
                            enableHighAccuracy: false
                        });
                }, 1000);
            };

            // Ask to turn on GPS
            const askGPS = () => {
                RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                    interval: 5000,
                    fastInterval: 1000,
                })
                    .then(response => {
                        if (response === 'enabled' || response === 'already-enabled') {
                            // Set location watch after a timeout
                            setTimeout(setLocationWatch, 1000);
                        }
                    });
            };
            askGPS();
        }
    };

    // Hide status bar and splash screen
    React.useEffect(() => {
        StatusBar.setHidden(true);
        SplashScreen.hide();
    }, []);

    // Set geolocation callbacks
    React.useEffect(() => {
        configureLocation();
    }, []);

    // Clear location on unmount
    React.useEffect(() => {
        return () => {
            if (locationWatch !== null) {
                clearInterval(locationWatch);
            }
        };
    }, []);

    // Check history of traveling
    React.useEffect(() => {
        AsyncStorage.getItem('@history')
            .then(history => {
                if (history) {
                    JSON.parse(history).forEach(item => {
                        dispatch(setAction('history', item));
                    });
                }
            });
    }, []);

    return (
        <React.Fragment>
            <Navigator />
            <ToastView />
            {spinner && <Spinner />}
        </React.Fragment>
)
}

export default function App() {
    return (
        <Provider store={store}>
            <AppRoot/>
        </Provider>
);
}
