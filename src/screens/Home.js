import React from 'react';
import {MapContainer, StaticMap, Popup, Button} from "../components";
import LinearGradient from "react-native-linear-gradient";
import getTheme from "../global/Style";
import {setAction} from "../store";
import {useDispatch} from "react-redux";
import {getPlaceIdByCoordinated} from '../utils/Geolocation';
import Toast from "react-native-simple-toast";
import {Animated, Easing, View, Text} from "react-native";
import {useSelector} from "react-redux";

export default function Home() {
    const theme = getTheme();
    const styles = getStyles(theme);
    const dispatch = useDispatch();
    const { selectedPlace } = useSelector(state => state);

    const [mapRef, setMapRef] = React.useState(null);
    const [modal, setModal] = React.useState(false);
    const [pins, setPins] = React.useState([]);

    const movingAnimation = React.useRef(new Animated.Value(60)).current;

    const onPress = React.useCallback((e) => {
        const {coordinate} = e.nativeEvent;
        getPlaceIdByCoordinated(coordinate)
            .then((res) => {
                if (res.status === 200) {
                    const { data } = res;
                    const { results } = data;
                    dispatch(setAction('place', { placeId: results[0].place_id }));
                }
                else Toast.show('Unable to connect', Toast.SHORT);
            });
    }, []);
    const onSelect = React.useCallback((place) => {
        const { location } = place;
        if (location.lng && location.lat) {
            mapRef && mapRef.animateToRegion({
                longitude: location.lng,
                latitude: location.lat,
                latitudeDelta: 0.01250270688370961,
                longitudeDelta: 0.01358723958820065,
            }, 1200);

            setPins([]);
            setPins(prev => {
               return [...prev, { location, color: theme.textPlaceholder }];
            });
        }

        setModal(true);
    }, []);

    const onSetAsStart = React.useCallback(() => {
        dispatch(setAction('startLocation', selectedPlace));
    }, [selectedPlace]);

    const onSetAsEnd = React.useCallback(() => {
        dispatch(setAction('endLocation', selectedPlace));
    }, [selectedPlace]);

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
            <MapContainer
                onSetRef={(ref) => setMapRef(ref)}
                onPress={onPress}
                onPinClick={() => setModal(true)}
                pins={pins}
            />
            <LinearGradient
                colors={[theme.rgba(theme.grey, 1), theme.rgba(theme.grey, 0)]}
                style={styles.gradient}
            />
            <StaticMap
                mapRef={mapRef}
                modal={modal}
                setModal={setModal}
                onSelect={onSelect}
                movingAnimation={movingAnimation}
                setPins={setPins}
            />
            <Popup visible={modal} style={styles.modal} onClose={() => setModal(false)}>
                <Text>{selectedPlace.name}</Text>
                <View style={{height: theme.scale(15)}}/>
                <Button text={'Set as destination'}
                        textColor={theme.black}
                        onPress={onSetAsStart}
                />
                <View style={{height: theme.scale(15)}}/>
                <Button text={'Set as start position'}
                        textColor={theme.black}
                        onPress={onSetAsEnd}
                />
            </Popup>
        </React.Fragment>
    )
}

function getStyles(theme) {
    return {
        gradient: {
            flex: 1,
            width: '100%',
            height: theme.scale(150),
            position: 'absolute',
            top: 0,
        },
        modal: {
            height: theme.scale(230),
            backgroundColor: theme.rgba(theme.grey, 0.8),
            borderTopLeftRadius: theme.scale(20),
            borderTopRightRadius: theme.scale(20),
            paddingTop: theme.scale(20),
            paddingHorizontal: theme.scale(20),
        },
    }
}
