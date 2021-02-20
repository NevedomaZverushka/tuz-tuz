import React from 'react';
import { View, Animated, Easing, TouchableOpacity, Text, Keyboard } from 'react-native';
import getTheme from "../global/Style";
import {Icon, Input} from "./index";
import {searchPlace} from '../utils/Geolocation';
import {convertDistance} from '../utils/Distance';
import { useSelector, useDispatch } from 'react-redux';
import { setAction } from "../store";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

const Separator = () => {
    const theme = getTheme();
    return(
        <View style={{ width: '100%', height: theme.scale(20)}} />
    )
};

export default function SearchBox(props) {
    const theme = getTheme();
    const styles = getStyles(getTheme());
    const {token, userLocation, recentLocations} = useSelector(state => state);
    const dispatch = useDispatch();
    const { navigate } = useNavigation();
    const { locked, onClearLocation } = props;

    const [text, setText] = React.useState('');
    const [searching, setSearching] = React.useState(false);
    const [placesList, setPlacesList] = React.useState([]);
    const [recentPlacesList, setRecentPlacesList] = React.useState([]);

    let inputRef = React.useRef(null);
    const fadeAnimation = React.useRef(new Animated.Value(0)).current;

    const onEndSearching = React.useCallback(() => {
        setText('');
        Keyboard.dismiss();
        Animated.timing(fadeAnimation, {
            toValue: 0,
            easing: Easing.linear(),
            duration: 300
        }).start(() => setSearching(false));
    }, [fadeAnimation, inputRef]);
    const onSelect = React.useCallback((place, recent = false) => {
        setPlacesList([]);
        onEndSearching();

        if (recent) {
            dispatch(setAction('place', { placeId: place.placeId }));
        }
        else {
            const { place_id, description } = place;
            const data = { placeId: place_id, address: description };

            if (recentLocations.includes(data)) {
                dispatch(setAction('place', { placeId: place_id }));
            }
            else {
                AsyncStorage.setItem(
                    '@history',
                    JSON.stringify(
                        recentLocations.length === 6
                            ? [...recentLocations.slice(1), data]
                            : [...recentLocations, data]
                    )
                ).then(() => {
                    setRecentPlacesList(prev => [...prev, data]);
                    dispatch(setAction('place', { placeId: place_id }));
                    dispatch(setAction('history', data));
                });
            }
        }
    }, [recentLocations]);
    const onDeselect = React.useCallback(() => {
        onClearLocation();
    }, []);

    React.useEffect(() => {
        if (recentLocations.length !== 0) setRecentPlacesList(recentLocations);
    }, [recentLocations]);
    React.useEffect(() => {
        if (searching) {
            Animated.timing(fadeAnimation, {
                toValue: 1,
                easing: Easing.linear(),
                duration: 300
            }).start();
        }
    }, [searching, fadeAnimation]);
    React.useEffect(() => {
        if (text !== '') {
            searchPlace(text, token, userLocation)
                .then(res => {
                    if (res.status === 200) {
                        const { data } = res;
                        setPlacesList(data.predictions);
                    }
                    else Toast.show('Unable to connect', Toast.SHORT);
                });
        }
        else setPlacesList([]);
    }, [text, token, userLocation]);

    return(
        <React.Fragment>
            <View style={styles.searchBox}>
                <View style={{ flex: 0.15 }}>
                    {(searching || locked)
                        ? (
                            <TouchableOpacity onPress={locked ? onDeselect : onEndSearching}>
                                <Icon
                                    name={'arrow-back'}
                                    color={theme.textAccent}
                                    size={theme.scale(22)}
                                />
                            </TouchableOpacity>
                        )
                        : (
                            <Icon
                                name={'search'}
                                color={theme.textAccent}
                                size={theme.scale(22)}
                            />
                        )
                    }
                </View>
                <Input
                    onSetRef={(ref) => { inputRef = ref }}
                    value={text}
                    setValue={setText}
                    placeholder={'Search for locations...'}
                    placeholderColor={theme.textAccent}
                    style={styles.searchText}
                    onFocus={() => setSearching(true)}
                    onBlur={onEndSearching}
                />
                {!locked && (
                    text !== ''
                        ? (
                            <TouchableOpacity onPress={() => setText('')} style={{ flex: 0.1 }}>
                                <Icon
                                    name={'close'}
                                    color={theme.textAccent}
                                    size={theme.scale(22)}
                                />
                            </TouchableOpacity>
                        )
                        : (
                            <TouchableOpacity onPress={() => navigate('FavoriteLocations')} style={{ flex: 0.1 }}>
                                <Icon
                                    name={'star-border'}
                                    color={theme.textAccent}
                                    size={theme.scale(22)}
                                />
                            </TouchableOpacity>
                        )
                )}
            </View>
            {searching && (
                <React.Fragment>
                    <Animated.View style={[styles.searchList, { opacity: fadeAnimation }]}>
                        <Text style={styles.placeholder}>
                            {`${text !== '' ? 'Top' : 'Last'} locations:`}
                        </Text>
                        {(placesList.length === 0 && text === '' && recentPlacesList.length === 0) && (
                            <Text style={styles.secondaryPlaceholder}>No recent locations</Text>
                        )}
                        {placesList.length !== 0 && placesList.map((place, idx) => {
                            return(
                                <React.Fragment key={idx}>
                                    <TouchableOpacity
                                        style={theme.rowAlignedBetween}
                                        onPress={() => onSelect(place)}
                                    >
                                        <Icon
                                            name={'arrow-up-left'}
                                            color={theme.textAccent}
                                            size={theme.scale(22)}
                                            style={{ flex: 0.1 }}
                                        />
                                        <Text
                                            style={[styles.placeText, { flex: 0.8 }]}
                                            numberOfLines={2}
                                            ellipsizeMode='tail'
                                        >
                                            {place.description}
                                        </Text>
                                        <Text style={styles.distanceText}>
                                            {convertDistance(place.distance_meters)}
                                        </Text>
                                    </TouchableOpacity>
                                    <Separator />
                                </React.Fragment>
                            )
                        })}
                        {placesList.length === 0 && recentPlacesList.reverse().map((place, idx) => {
                            return(
                                <React.Fragment key={idx}>
                                    <TouchableOpacity
                                        style={theme.rowAlignedBetween}
                                        onPress={() => onSelect(place, true)}
                                    >
                                        <Icon
                                            name={'access-time'}
                                            color={theme.textAccent}
                                            size={theme.scale(22)}
                                            style={{ flex: 0.1 }}
                                        />
                                        <Text
                                            style={[styles.placeText, { flex: 0.9 }]}
                                            numberOfLines={2}
                                            ellipsizeMode='tail'
                                        >
                                            {place.address}
                                        </Text>
                                    </TouchableOpacity>
                                    <Separator />
                                </React.Fragment>
                            )
                        })}
                    </Animated.View>
                    <Animated.View style={[styles.searchBackground, { opacity: fadeAnimation }]} />
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

function getStyles(theme) {
    return {
        searchBox: {
            ...theme.rowAlignedBetween,
            flex: 1,
            paddingVertical: theme.scale(10),
            paddingHorizontal: theme.scale(20),
            position: 'absolute',
            top: 0,
            zIndex: 2,
            width: '100%',
            height: theme.scale(60)
        },
        searchList: {
            ...theme.rowAlignedVertical,
            flex: 1,
            top: theme.scale(60),
            zIndex: 2,
            width: '100%',
            position: 'absolute',
            paddingHorizontal: theme.scale(20),
            paddingVertical: theme.scale(10),
        },
        searchText: [
            theme.textStyle({
                font: 'NunitoRegular',
                color: 'textAccent',
                size: 16,
                align: 'left'
            }),
            {
                flex: 0.9,
            }
        ],
        searchBackground: [
            {
                backgroundColor: theme.black,
                position: 'absolute',
                top: 0,
                zIndex: 1,
                flex: 1,
            },
            theme.fullScreen
        ],
        placeText: theme.textStyle({
            font: 'NunitoRegular',
            color: 'textPlaceholder',
            size: 14,
            align: 'left'
        }),
        distanceText: [
            theme.textStyle({
                font: 'NunitoRegular',
                color: 'textSecondary',
                size: 12,
                align: 'right'
            }),
            {
                flex: 0.2,
            }
        ],
        placeholder: [
            theme.textStyle({
                font: 'NunitoRegular',
                color: 'textSecondary',
                size: 14,
                align: 'left'
            }),
            {
                marginBottom: theme.scale(25)
            }
        ],
        secondaryPlaceholder: [
            theme.textStyle({
                font: 'NunitoRegular',
                color: 'textSecondary',
                size: 14,
                align: 'center'
            }),
            {
                marginTop: theme.scale(50)
            }
        ]
    };
}
