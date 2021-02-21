import React from 'react';
import {View, Text, TouchableOpacity} from "react-native";
import getTheme from "../global/Style";
import {Header, MapContainer, Icon} from "../components";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {setAction} from "../store";
import {getPlaceIdByCoordinated, getPlaceDetail} from '../utils/Geolocation';
import {getDirection} from '../utils/Direction';
import Toast from "react-native-simple-toast";
import {launchCamera} from 'react-native-image-picker';
import SecureStorage from "react-native-secure-storage";
import API from "../global/API";

export default function Form() {
    const theme = getTheme();
    const styles = getStyles(theme);
    const {navigate} = useNavigation();
    const dispatch = useDispatch();
    const {startLocation, endLocation, token, steps, user} = useSelector(state => state);

    const [loading, setLoading] = React.useState(true);

    const [start, setStart] = React.useState(null);
    const [finish, setFinish] = React.useState(null);

    const [points, setPoints] = React.useState([]);
    const [mapRef, setMapRef] = React.useState(null);
    const [pins, setPins] = React.useState([]);

    const [file, setFile] = React.useState(null);

    React.useEffect(() => {
        dispatch(setAction('spinner', loading));
    }, [loading]);

    const onMoveCamera = React.useCallback((coords) => {
        mapRef && mapRef.fitToCoordinates(coords, {animated: true});
    }, [mapRef]);
    const onMakePhoto = React.useCallback(() => {
        launchCamera({}, (data) => setFile(data));
    }, []);

    React.useEffect(() => {
        getPlaceIdByCoordinated({latitude: startLocation.location.lat, longitude: startLocation.location.lng})
            .then((startIdData) => {
                if (startIdData.status === 200) {
                    getPlaceDetail(startIdData.data.results[0].place_id, token)
                        .then((startData) => {
                            if (startData.status === 200) {
                                setStart({
                                    name: startData.data.result.name,
                                    location: startLocation,
                                    address: startData.data.result.formatted_address,
                                });
                                setFinish(endLocation);

                                getDirection(startLocation.location, endLocation.location)
                                    .then((res) => {
                                        if (res.status === 200) {
                                            const {data} = res;
                                            const {routes} = data;
                                            const {bounds, legs} = routes[0];
                                            const {steps} = legs[0];

                                            const coords = [
                                                {latitude: bounds.northeast.lat, longitude: bounds.northeast.lng},
                                                {latitude: bounds.southwest.lat, longitude: bounds.southwest.lng}
                                            ];

                                            const tempPoints = (steps.map((step) => {
                                                const {start_location, end_location} = step;
                                                return (
                                                    [
                                                        {latitude: start_location.lat, longitude: start_location.lng},
                                                        {latitude: end_location.lat, longitude: end_location.lng}
                                                    ]
                                                )
                                            })).flat();

                                            setLoading(false);
                                            setPoints(tempPoints);
                                            onMoveCamera(coords);
                                            setPins([
                                                {color: theme.textPrimary, location: startLocation.location},
                                                {color: theme.textPrimary, location: endLocation.location}
                                            ]);
                                        } else Toast.show('Unable to connect', Toast.SHORT);
                                    });
                            } else Toast.show('Unable to connect', Toast.SHORT);
                        });
                } else Toast.show('Unable to connect', Toast.SHORT);
            });
    }, [startLocation, endLocation, mapRef]);

    const onConfirmTrip = React.useCallback(() => {
        // SecureStorage.getItem('token')
        //     .then(token => {
        //         if (user) {
        //             API.createOrder({
        //                 from: start.name,
        //                 to: finish.name,
        //                 passenger_id: user.id,
        //                 image: file
        //             }, token)
        //                 .then(res => {
        //                     console.log(res.data);
        //                     if (res.status === 200) {
        //navigate('StatusScreen', {order: res.data.order})
        navigate('StatusScreen', {
            order: {
                id: '5d2ab711-58f1-46a0-986f-1b1e10d85472',
                from: 'МЕБЕЛЬ-ЭКСПО',
                to: 'БЮРО ПЕРЕКЛАДІВ ЛІГА',
                passengerId: '0f6d00cd-2ca9-4a6d-b5ed-8f6e36ad3bed',
                driverId: null,
                status: 'searching',
                image: null
            }
        })
        //                 }
        //             })
        //             .catch(err => console.log(err));
        //     } else {
        //         console.log('no user');
        //     }
        // });
    }, [start, finish, file]);

    if (loading) return null;
    return (
        <View style={styles.container}>
            <Header
                subtext={`Drive to`}
                text={start?.name}
                leftIcon={"arrow-back"}
                rightIcon={"check"}
                onClickLeftIcon={() => navigate('Home')}
                onClickRightIcon={onConfirmTrip}
                noMoves={true}
            />
            <MapContainer
                onSetRef={(ref) => setMapRef(ref)}
                points={points}
                pins={pins}
                containerStyle={{width: '100%', height: theme.scale(210)}}
            />
            <View style={styles.form}>
                <Icon
                    name={"source-commit-start"}
                    size={theme.scale(35)}
                    color={theme.background}
                />
                <Text style={styles.address}>{start?.name}</Text>
                <Icon
                    name={"source-commit"}
                    size={theme.scale(35)}
                    color={theme.background}
                />
                <Text style={styles.address}>{finish?.name}</Text>
                <Icon
                    name={"source-commit-end"}
                    size={theme.scale(35)}
                    color={theme.background}
                />
                <View style={styles.filePicker}>
                    <Text style={styles.filePickerText}>Make a photo of your place:</Text>
                    <TouchableOpacity onPress={onMakePhoto}>
                        <Icon
                            name={"camerao"}
                            size={theme.scale(35)}
                            color={theme.textPrimary}
                        />
                    </TouchableOpacity>
                </View>
                {file && (
                    <Text style={[styles.filePickerText, {marginTop: theme.scale(5)}]}>{file.name}</Text>
                )}
            </View>
        </View>
    );
}

function getStyles(theme) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.white
        },
        form: {
            ...theme.rowAlignedCenterVertical,
            paddingHorizontal: theme.scale(10),
            paddingVertical: theme.scale(10)
        },
        address: [
            theme.textStyle({
                font: 'NunitoBold',
                color: 'background',
                size: 16,
                align: 'center'
            }),
            {
                paddingVertical: theme.scale(5)
            }
        ],
        filePicker: {
            ...theme.rowAlignedBetween,
            marginTop: theme.scale(10)
        },
        filePickerText: {
            ...theme.textStyle({
                font: 'NunitoBold',
                color: 'grey',
                size: 14,
                align: 'left',
            }),
            marginRight: theme.scale(5),
        },
    }
}
