import React from 'react';
import {Animated, Easing, Text, TouchableOpacity, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Button, Icon, Popup} from "./index";
import getTheme from "../global/Style";
import { getDirection } from '../utils/Direction';
import {convertDistance} from "../utils/Distance";
import {useNavigation} from "@react-navigation/native";
import Toast from "react-native-simple-toast";
import {setAction} from "../store";

const formattedSeconds = (seconds) => {
    let min = Math.ceil(seconds / 60);
    let hours = 0;
    if (min >= 60) {
        hours = Math.floor(min / 60);
        min -= hours * 60;
    }
    return (hours ? `${hours}h` : '') + `${min}m`;
};

export default function DirectionMap(props) {
    const theme = getTheme();
    const styles = getStyles(theme);
    const { mapRef, setPoints, onClose } = props;
    const {userLocation, selectedPlace} = useSelector(state => state);
    const { navigate } = useNavigation();
    const dispatch = useDispatch();

    const [modal, setModal] = React.useState(true);
    const [cameraPosition, setCameraPosition] = React.useState([]);
    const [travelTime, setTravelTime] = React.useState(0);

    const movingAnimation = React.useRef(new Animated.Value(60)).current;

    const onMoveToCurrentLocation = React.useCallback(() => {
        const { lat, lng } = userLocation;
        if (lat && lng) {
            mapRef && mapRef.animateToRegion({
                longitude: lng,
                latitude: lat,
                latitudeDelta: 0.01250270688370961,
                longitudeDelta: 0.01358723958820065,
            }, 1200);
        }
    }, [userLocation, mapRef]);
    const onMoveCamera = React.useCallback((coords) => {
        mapRef.fitToCoordinates(
            coords,
            {
                edgePadding: { top: 0, right: theme.scale(30), bottom: theme.scale(450), left: theme.scale(30) },
                animated: true
            }
        );
    }, [mapRef]);

    React.useEffect(() => {
        getDirection(userLocation, selectedPlace.location)
            .then((res) => {
                if (res.status === 200) {
                    const { data } = res;
                    const { routes } = data;
                    const { bounds, legs } = routes[0];
                    const { steps } = legs[0];

                    dispatch(setAction('directions', steps));

                    const coords = [
                        { latitude: bounds.northeast.lat, longitude: bounds.northeast.lng },
                        { latitude: bounds.southwest.lat, longitude: bounds.southwest.lng }
                    ];

                    dispatch(setAction('bounds', coords));

                    let time = 0;
                    const points = (steps.map((step) => {
                        const { duration, start_location, end_location } = step;
                        time += duration.value;

                        return(
                            [
                                { latitude: start_location.lat, longitude: start_location.lng },
                                { latitude: end_location.lat, longitude: end_location.lng }
                            ]
                        )
                    })).flat();

                    setPoints(points);
                    setTravelTime(time);
                    setCameraPosition(coords);
                    onMoveCamera(coords);
                }
                else Toast.show('Unable to connect', Toast.SHORT);
            });
    }, [selectedPlace, mapRef]);
    React.useEffect(() => {
        if (modal) {
            Animated.timing(movingAnimation, {
                toValue: 310,
                easing: Easing.linear(),
                duration: 300
            }).start();
        }
        else {
            Animated.timing(movingAnimation, {
                toValue: 60,
                easing: Easing.linear(),
                duration: 300
            }).start();
        }
    }, [modal]);

    return(
        <React.Fragment>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={{ flex: 0.1, margin: theme.scale(2) }}>
                    <Icon
                        name={'arrow-back'}
                        color={theme.textAccent}
                        size={theme.scale(20)}
                    />
                </TouchableOpacity>
                <View
                    style={
                        [
                            theme.rowAlignedCenterVertical,
                            { flex: 0.9, paddingRight: theme.scale(30) }
                        ]
                    }
                >
                    <Text style={styles.secondaryHeaderText}>go to</Text>
                    <Text style={styles.headerText} numberOfLines={1}>{selectedPlace.name}</Text>
                </View>
            </View>
            <Animated.View style={[styles.btnBar, { bottom: movingAnimation }]}>
                <TouchableOpacity onPress={onClose}>
                    <Icon
                        name={'close'}
                        color={theme.textAccent}
                        size={theme.scale(25)}
                        style={styles.roundBtn}
                    />
                </TouchableOpacity>
                <View style={{ height: theme.scale(15) }} />
                <TouchableOpacity onPress={() => onMoveCamera(cameraPosition)}>
                    <Icon
                        name={'navigation-2'}
                        color={theme.textAccent}
                        size={theme.scale(22)}
                        style={styles.roundBtn}
                    />
                </TouchableOpacity>
                <View style={{ height: theme.scale(15) }} />
                <TouchableOpacity onPress={() => onMoveToCurrentLocation()}>
                    <Icon
                        name={'my-location'}
                        color={theme.textAccent}
                        size={theme.scale(25)}
                        style={styles.roundBtn}
                    />
                </TouchableOpacity>
                {!modal && (
                    <React.Fragment>
                        <View style={{ height: theme.scale(15) }} />
                        <TouchableOpacity onPress={() => setModal(true)}>
                            <Icon
                                name={'layers-outline'}
                                color={theme.textAccent}
                                size={theme.scale(25)}
                                style={styles.roundBtn}
                            />
                        </TouchableOpacity>
                    </React.Fragment>
                )}
            </Animated.View>
            <Popup visible={modal} style={styles.modal} onClose={() => setModal(false)}>
                <View style={theme.rowAlignedCenterVertical}>
                    <View style={styles.bar} />
                </View>
                <View
                    style={
                        [
                            theme.rowAlignedBetweenStretch,
                            { marginBottom: theme.scale(15), paddingHorizontal: theme.scale(70) }
                        ]
                    }
                >
                    <View style={theme.rowAlignedCenterVertical}>
                        <Text style={styles.numericText}>{formattedSeconds(travelTime)}</Text>
                        <Text style={styles.placeholderCenter}>time to go</Text>
                    </View>
                    <View style={theme.rowAlignedCenterVertical}>
                        <Text style={styles.numericText}>{convertDistance(selectedPlace.distance)}</Text>
                        <Text style={styles.placeholderCenter}>away</Text>
                    </View>
                </View>
                <Text style={styles.placeholder} numberOfLines={2}>
                    Finish point address: <Text style={styles.addressText}>{selectedPlace.address}</Text>
                </Text>
                <Button
                    text={'Start trip'}
                    onPress={() => navigate('AR')}
                    containerStyle={{ flex: 1, width: '100%', marginTop: theme.scale(22) }}
                />
            </Popup>
        </React.Fragment>
    )
}

function getStyles(theme) {
    return {
        header: {
            ...theme.rowAlignedBetween,
            flex: 1,
            paddingVertical: theme.scale(10),
            paddingHorizontal: theme.scale(20),
            position: 'absolute',
            top: 0,
            zIndex: 2,
            width: '100%',
            height: theme.scale(80)
        },
        headerText: theme.textStyle({
            font: 'NunitoBold',
            color: 'textAccent',
            size: 18,
            align: 'center'
        }),
        secondaryHeaderText: [
            theme.textStyle({
                font: 'NunitoRegular',
                color: 'textPlaceholder',
                size: 14,
                align: 'center'
            }),
            {
                marginBottom: theme.scale(5)
            }
        ],
        btnBar: {
            ...theme.rowAlignedRightVertical,
            position: 'absolute',
            width: '100%',
            flex: 1,
            paddingHorizontal: theme.scale(25),
        },
        roundBtn: {
            ...theme.rowAlignedCenterVertical,
            height: theme.scale(45),
            width: theme.scale(45),
            padding: theme.scale(10),
            backgroundColor: theme.rgba(theme.black, 0.8),
            borderRadius: 150/2,
        },
        modal: {
            height: theme.scale(230),
            backgroundColor: theme.rgba(theme.black, 0.8),
            borderTopLeftRadius: theme.scale(20),
            borderTopRightRadius: theme.scale(20),
            paddingVertical: theme.scale(20),
            paddingHorizontal: theme.scale(20),
        },
        bar: {
            width: theme.scale(50),
            height: theme.scale(4),
            backgroundColor: theme.textSecondary,
            borderRadius: theme.scale(10),
            marginBottom: theme.scale(15)
        },
        placeholder: theme.textStyle({
            font: 'NunitoRegular',
            color: 'textSecondary',
            size: 12,
            align: 'left'
        }),
        placeholderCenter: theme.textStyle({
            font: 'NunitoMedium',
            color: 'textPlaceholder',
            size: 12,
            align: 'center'
        }),
        addressText: theme.textStyle({
            font: 'NunitoRegular',
            color: 'textPlaceholder',
            size: 12,
            align: 'left'
        }),
        numericText: theme.textStyle({
            font: 'NunitoMedium',
            color: 'textAccent',
            size: 18,
            align: 'center'
        }),
    }
}
