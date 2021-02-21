import React, {useRef} from 'react';
import getTheme from "../global/Style";
import {useDispatch, useSelector} from "react-redux";
import {Animated, TouchableOpacity, View} from "react-native";
import {getDistance} from "../utils/Distance";
import {cleanAction, setAction} from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getPlaceDetail} from "../utils/Geolocation";
import {Icon, SearchBox} from "./index";
import Toast from "react-native-simple-toast";
import Voice from '@react-native-voice/voice';

let movedToCurrent = false;

export default function StaticMap(props) {
    const theme = getTheme();
    const styles = getStyles(theme);
    const {token, userLocation, selectedPlace} = useSelector(state => state);
    const dispatch = useDispatch();

    const { mapRef, onSelect, movingAnimation, setPins, setModal, modal} = props;

    const [followUserMode, setFollowUserMode] = React.useState(true);

    const [voiceInputOn, setVoiceInput] = React.useState(false);
    const voiceAnim = React.useRef(new Animated.Value(1)).current;
    const springValue = React.useRef(new Animated.Value(0)).current;

    const onMoveToCurrentLocation = React.useCallback((flag = true, callback) => {
        const { lat, lng } = userLocation;
        if (lat && lng) {
            flag && setFollowUserMode(true);
            mapRef && callback ? callback() : null;
            mapRef && mapRef.animateToRegion({
                longitude: lng,
                latitude: lat,
                latitudeDelta: 0.01250270688370961,
                longitudeDelta: 0.01358723958820065,
            }, 1200);
        }
    }, [userLocation, mapRef]);
    const onMoveToLocation = React.useCallback((coords) => {
        mapRef && mapRef.animateToRegion({
            longitude: coords.lng,
            latitude: coords.lat,
            latitudeDelta: 0.01250270688370961,
            longitudeDelta: 0.01358723958820065,
        }, 1200);
    }, [mapRef]);
    const onGetDistance = React.useCallback((coords) => {
        return getDistance(userLocation, coords);
    }, [userLocation]);
    const onUnlocked = React.useCallback(() => {
        setFollowUserMode(true);
        dispatch(cleanAction('place'));
        setPins([]);
        setModal(false);
    }, []);
    const onSelectFavoriteLocation = React.useCallback(() => {
        AsyncStorage.getItem('@favorites')
            .then(favorites => {
                const data = favorites ? JSON.parse(favorites) : [];
                if (selectedPlace.isFavorite) {
                    AsyncStorage.setItem(
                        '@favorites',
                        JSON.stringify(data.filter(item => item.placeId !== selectedPlace.placeId))
                    ).then(() => {
                        dispatch(setAction('place', { isFavorite: !selectedPlace.isFavorite }));
                    });
                }
                else {
                    AsyncStorage.setItem(
                        '@favorites',
                        JSON.stringify(
                            [
                                ...data,
                                { placeId: selectedPlace.placeId, address: selectedPlace.address }
                            ]
                        )
                    ).then(() => {
                        dispatch(setAction('place', { isFavorite: !selectedPlace.isFavorite }));
                    });
                }
            });
    }, [selectedPlace]);

    React.useEffect(() => {
        if (followUserMode) onMoveToCurrentLocation();
    }, [followUserMode]);
    React.useEffect(() => {
        if (!movedToCurrent && mapRef !== null && userLocation.lat !== null && userLocation.lng !== null) {
            setTimeout(() => onMoveToCurrentLocation(true, () => movedToCurrent = true), 250);
        }
    }, [userLocation, mapRef]);
    React.useEffect(() => {
        if (selectedPlace.placeId) {
            setFollowUserMode(false);
            getPlaceDetail(selectedPlace.placeId, token)
                .then(res => {
                    if (res.status === 200) {
                        const { geometry, formatted_address, photos, name } = res.data.result;

                        AsyncStorage.getItem('@favorites')
                            .then((favorites) => {
                                let isFavorite = false;

                                if (favorites) {
                                    JSON.parse(favorites).forEach((favorite) => {
                                        if (favorite.placeId === selectedPlace.placeId) isFavorite = true;
                                    });
                                }
                                const place = {
                                    name,
                                    location: geometry.location,
                                    address: formatted_address,
                                    photo: photos && photos?.length !== 0 ? photos[0] : null,
                                    distance: onGetDistance(geometry.location),
                                    isFavorite,
                                    isFullData: true
                                };

                                dispatch(
                                    setAction(
                                        'place',
                                        place
                                    )
                                );
                                onSelect(place);
                                onMoveToLocation({ lat: geometry.location.lat, lng: geometry.location.lng });
                            })
                    }
                    else Toast.show('Unable to connect', Toast.SHORT);
                });
        }
    }, [selectedPlace.placeId, token]);

    React.useEffect(() => {
        if (voiceInputOn) {
            Voice.start('ru-RU');


            let fadeInAndOut = Animated.sequence([
                Animated.timing(voiceAnim, {
                    toValue: 1,
                    duration: 750,
                }),
                Animated.timing(voiceAnim, {
                    toValue: 0,
                    duration: 750,
                }),
            ]);

            Animated.loop(
                Animated.parallel([
                    fadeInAndOut,
                    Animated.timing(springValue, {
                        toValue: 1,
                        friction: 3,
                        tension: 40,
                        duration: 1500,
                    }),
                ]),
            ).start();
        }
        else {
            Voice.stop();
            springValue.stopAnimation();
        }
    }, [voiceInputOn]);

    const onVoiceInputEnd = React.useCallback((text) => {
        console.log(text);
    }, []);

    React.useEffect(() => {
        Voice.onSpeechStart = () => {};
        Voice.onSpeechEnd = () => {};
        Voice.onSpeechResults = onVoiceInputEnd;
    });

    return(
        <React.Fragment>
            <SearchBox locked={!followUserMode} onClearLocation={onUnlocked} />
            <Animated.View style={[styles.btnBar, { bottom: movingAnimation }]}>
                {selectedPlace.isFullData && (
                    <React.Fragment>
                        <TouchableOpacity onPress={onUnlocked}>
                            <Icon
                                name={'close'}
                                color={theme.textSecondary}
                                size={theme.scale(25)}
                                style={styles.roundBtn}
                            />
                        </TouchableOpacity>
                        <View style={{ height: theme.scale(15) }} />
                    </React.Fragment>
                )}
                <Animated.View style={{ opacity: voiceAnim }}>
                    <TouchableOpacity onPress={() => setVoiceInput(!voiceInputOn)}>
                        <Icon
                            name={'microphone'}
                            color={theme.textSecondary}
                            size={theme.scale(25)}
                            style={styles.roundBtn}
                        />
                    </TouchableOpacity>
                </Animated.View>
                <View style={{ height: theme.scale(15) }} />
                <TouchableOpacity onPress={() => onMoveToCurrentLocation(false)}>
                    <Icon
                        name={'my-location'}
                        color={theme.textSecondary}
                        size={theme.scale(25)}
                        style={styles.roundBtn}
                    />
                </TouchableOpacity>

                {(selectedPlace.isFullData && !modal) && (
                    <React.Fragment>
                        <View style={{ height: theme.scale(15) }} />
                        <TouchableOpacity onPress={() => setModal(true)}>
                            <Icon
                                name={'layers-outline'}
                                color={theme.textSecondary}
                                size={theme.scale(25)}
                                style={styles.roundBtn}
                            />
                        </TouchableOpacity>
                    </React.Fragment>
                )}
            </Animated.View>
        </React.Fragment>
    )
}

function getStyles(theme) {
    return {
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
            backgroundColor: theme.rgba(theme.grey, 0.8),
            borderRadius: 150/2,
        },
        image: {
            height: theme.scale(110),
            width: theme.scale(100),
            flex: 0.3,
        },
        textBox: {
            ...theme.rowAlignedBetweenVertical,
            flex: 0.7,
            paddingLeft: theme.scale(20)
        },
        primaryText: theme.textStyle({
            font: 'NunitoBold',
            color: 'textAccent',
            size: 16,
            align: 'left'
        }),
        secondaryText: theme.textStyle({
            font: 'NunitoRegular',
            color: 'textPlaceholder',
            size: 12,
            align: 'left'
        }),
        detailsText: theme.textStyle({
            font: 'NunitoRegular',
            color: 'textSecondary',
            size: 12,
            align: 'left'
        }),
        bar: {
            width: theme.scale(50),
            height: theme.scale(4),
            backgroundColor: theme.textSecondary,
            borderRadius: theme.scale(10),
            marginBottom: theme.scale(15)
        }
    }
}
