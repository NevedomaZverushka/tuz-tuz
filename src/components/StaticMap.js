import React from 'react';
import getTheme from "../global/Style";
import {useDispatch, useSelector} from "react-redux";
import {Animated, Easing, ImageBackground, Text, TouchableOpacity, View} from "react-native";
import {convertDistance, getDistance} from "../utils/Distance";
import {cleanAction, setAction} from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getPlaceDetail} from "../utils/Geolocation";
import {Button, Icon, Popup, SearchBox} from "./index";
import {GOOGLE_API_KEY} from "../global/Constants";
import Toast from "react-native-simple-toast";

const getImageUrl = (image) => {
    const { photo_reference, height, width } = image;
    return `https://maps.googleapis.com/maps/api/place/photo?key=${GOOGLE_API_KEY}&photoreference=${photo_reference}&maxheight=${height}&maxwidth=${width}`;
};

let movedToCurrent = false;

export default function StaticMap(props) {
    const theme = getTheme();
    const styles = getStyles(theme);
    const {token, userLocation, selectedPlace} = useSelector(state => state);
    const dispatch = useDispatch();

    const { mapRef, setPins, modal, setModal, onGoToLocation } = props;

    const [followUserMode, setFollowUserMode] = React.useState(true);

    const movingAnimation = React.useRef(new Animated.Value(60)).current;

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
        setModal(false);
        setPins([]);
        dispatch(cleanAction('place'));
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
                        setPins([{ location: geometry.location, color: theme.textAccent }]);

                        AsyncStorage.getItem('@favorites')
                            .then((favorites) => {
                                let isFavorite = false;

                                if (favorites) {
                                    JSON.parse(favorites).forEach((favorite) => {
                                        if (favorite.placeId === selectedPlace.placeId) isFavorite = true;
                                    });
                                }

                                dispatch(
                                    setAction(
                                        'place',
                                        {
                                            name,
                                            location: geometry.location,
                                            address: formatted_address,
                                            photo: photos && photos?.length !== 0 ? photos[0] : null,
                                            distance: onGetDistance(geometry.location),
                                            isFavorite,
                                            isFullData: true
                                        }
                                    )
                                );
                                setModal(true);
                                onMoveToLocation({ lat: geometry.location.lat, lng: geometry.location.lng });
                            })
                    }
                    else Toast.show('Unable to connect', Toast.SHORT);
                });
        }
    }, [selectedPlace.placeId, token]);
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
            <SearchBox locked={!followUserMode} onClearLocation={onUnlocked} />
            <Animated.View style={[styles.btnBar, { bottom: movingAnimation }]}>
                {selectedPlace.isFullData && (
                    <React.Fragment>
                        <TouchableOpacity onPress={onUnlocked}>
                            <Icon
                                name={'close'}
                                color={theme.textAccent}
                                size={theme.scale(25)}
                                style={styles.roundBtn}
                            />
                        </TouchableOpacity>
                        <View style={{ height: theme.scale(15) }} />
                        <TouchableOpacity onPress={() => onMoveToLocation(selectedPlace.location)}>
                            <Icon
                                name={'map-marker-alt'}
                                color={theme.textAccent}
                                size={theme.scale(22)}
                                style={styles.roundBtn}
                            />
                        </TouchableOpacity>
                        <View style={{ height: theme.scale(15) }} />
                    </React.Fragment>
                )}
                <TouchableOpacity onPress={() => onMoveToCurrentLocation(false)}>
                    <Icon
                        name={'my-location'}
                        color={theme.textAccent}
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
                                color={theme.textAccent}
                                size={theme.scale(25)}
                                style={styles.roundBtn}
                            />
                        </TouchableOpacity>
                    </React.Fragment>
                )}
            </Animated.View>
            <Popup visible={modal} style={styles.modal} onClose={() => setModal(false)}>
                {selectedPlace.isFullData && (
                    <View style={theme.rowAlignedCenterVertical}>
                        <View style={styles.row}>
                            <View style={styles.bar} />
                        </View>
                        <View style={theme.rowAlignedBetweenStretch}>
                            <ImageBackground
                                source={
                                    selectedPlace.photo
                                        ? {uri: getImageUrl(selectedPlace.photo)}
                                        : require('../assets/images/placeholder.jpg')
                                }
                                style={styles.image}
                                resizeMode={'cover'}
                            />
                            <View style={styles.textBox}>
                                <View style={[theme.rowAlignedBetweenStretch, { flex: 1 }]}>
                                    <Text style={[styles.primaryText, { flex: 0.9 }]} numberOfLines={1}>
                                        {selectedPlace.name}
                                    </Text>
                                    <TouchableOpacity
                                        style={{ paddingLeft: theme.scale(20), flex: 0.1 }}
                                        onPress={onSelectFavoriteLocation}
                                    >
                                        <Icon
                                            name={selectedPlace.isFavorite ? 'star' : 'star-border'}
                                            color={theme.textAccent}
                                            size={theme.scale(20)}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.secondaryText} numberOfLines={2}>
                                    {selectedPlace.address}
                                </Text>
                                <Text style={styles.detailsText}>
                                    {convertDistance(selectedPlace.distance)} away
                                </Text>
                            </View>
                        </View>
                        <Button
                            text={'Create route'}
                            onPress={onGoToLocation}
                            containerStyle={{ flex: 1, width: '100%', marginTop: theme.scale(22) }}
                        />
                    </View>
                )}
            </Popup>
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
            backgroundColor: theme.rgba(theme.black, 0.8),
            borderRadius: 150/2,
        },
        modal: {
            height: theme.scale(230),
            backgroundColor: theme.rgba(theme.black, 0.8),
            borderTopLeftRadius: theme.scale(20),
            borderTopRightRadius: theme.scale(20),
            paddingTop: theme.scale(20),
            paddingHorizontal: theme.scale(20),
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
