import React, {Component} from 'react';
import {View, Vibration, Text, TouchableOpacity, Alert, BackHandler} from 'react-native';

const {DeviceEventEmitter} = require('react-native');
const ReactNativeHeading = require('react-native-heading');

import {
    ViroARSceneNavigator,
    ViroMaterials,
} from 'react-viro';
import {Button, Icon, MapContainer, NavigatorScene, Popup} from "../components";
import {connect, useSelector} from 'react-redux';

import {bearing, calcCrow, rotatePoint} from "../utils/Coordinates";
import {ARWaypointMarker} from "../components";
import getTheme from "../global/Style";
import LinearGradient from "react-native-linear-gradient";
import { convertDistance } from '../utils/Distance';
import {cleanAction} from "../store";

class ARNavigator extends Component {

    constructor() {
        super();

        this.mapRef = null;

        this.headingOnTrackingLost = 0;
        this.headingAfterTrackingLost = 0;
        this.state = {
            heading: 0,
            initialHeading: null,
            initialPosition: null,
            trackingInitialized: false,
            trackingGood: false,
            trackingHeadingFix: 0,
            modal: false,
        };
    }

    componentDidMount() {
        ReactNativeHeading.start(1)
            .then(didStart => {
                this.setState({
                    headingIsSupported: didStart,
                })
            });

        DeviceEventEmitter.addListener('headingUpdated', data => {
            data = (data + 360) % 360;
            this.setState({
                heading: data,
            });
        });

        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.onClose
        );
    }

    componentDidUpdate(prevProps, prevState) {
        const {userLocation} = this.props;
        const {initialPosition} = this.state;

        if (prevProps.userLocation !== userLocation)
        {
            if (initialPosition === null) {
                this.setState({initialPosition: userLocation});
            }
        }
    }

    updateInitialHeading = () => {
        const {heading} = this.state;
        this.setState({initialHeading: heading})
    };

    updateTrackingStatus = (isNormal, isInitialized) => {
        this.setState({
            trackingInitialized: isInitialized,
            trackingGood: isNormal,
        })
    };

    onTrackingLost = () => {
        const {heading} = this.state;
        //console.log('lost', heading);
        this.updateTrackingStatus(false, true);
        this.headingOnTrackingLost = heading;
    };

    onTrackingRecovered = () => {
        const {heading, trackingHeadingFix} = this.state;
        //console.log('recovered', heading);
        this.headingAfterTrackingLost = heading;
        this.updateTrackingStatus(true, true);
        const fix = this.headingOnTrackingLost - this.headingAfterTrackingLost;

        //console.log('fix', fix);

        this.setState({
            trackingHeadingFix: trackingHeadingFix + fix,
        });
    };

    componentWillUnmount() {
        ReactNativeHeading.stop();
        DeviceEventEmitter.removeAllListeners('headingUpdated');
        this.backHandler.remove();
    }

    drawWaypoint = (waypointLocation) => {
        const {initialHeading, initialPosition, trackingHeadingFix} = this.state;

        //-console.log(initialHeading, !!initialPosition)
        if (waypointLocation && initialHeading !== null && initialPosition !== null) {
            const distance = calcCrow(
                initialPosition.lat, initialPosition.lng,
                waypointLocation.lat, waypointLocation.lng
            );
            const angle = bearing(
                initialPosition.lat, initialPosition.lng,
                waypointLocation.lat, waypointLocation.lng
            );
            let point = [0, 0, -distance];
            point = rotatePoint(point, angle - initialHeading + trackingHeadingFix);

            //console.log(distance, angle, initialHeading, point);
            let multiplier = 1;
            if (distance >= 50) {
                multiplier = distance / 50
            }

            const scale = [multiplier, multiplier, multiplier];

            return <ARWaypointMarker point={point} scale={scale}/>;
        }
        return null;
    };

    //Vibration.vibrate([0, 150, 20, 150]);

    onClose = () => {
        Alert.alert("Hold on!", "Are you sure you want to go back?", [
            {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
            },
            {
                text: "YES",
                onPress: () => {
                    this.props.navigation.navigate('Home');
                    this.props.cleanBounds();

                }
            }
        ]);
        return true;
    };

    render() {
        const theme = getTheme();
        const styles = getStyles(theme);
        const {userLocation, directions, selectedPlace} = this.props;
        const {heading, trackingGood, trackingInitialized} = this.state;

        let waypoint = { lat: 47.90989468835377, lng: 33.39104752394221};

        let distance = 0;
        let angle = 0;

        if (waypoint && userLocation.lat !== null) {
            distance = calcCrow(
                userLocation.lat, userLocation.lng,
                waypoint.lat, waypoint.lng
            );
            angle = heading - bearing(
                userLocation.lat, userLocation.lng,
                waypoint.lat, waypoint.lng
            );
        }

        const points = (directions.map((step) => {
            const { start_location, end_location } = step;
            return(
                [
                    { latitude: start_location.lat, longitude: start_location.lng },
                    { latitude: end_location.lat, longitude: end_location.lng }
                ]
            )
        })).flat();

        return (
            <View style={{flex: 1}}>
                <ViroARSceneNavigator
                    viroAppProps={{
                        waypoint: this.drawWaypoint(waypoint),
                        updateInitialHeading: this.updateInitialHeading,
                        updateTrackingStatus: this.updateTrackingStatus,
                        onTrackingLost: this.onTrackingLost,
                        onTrackingRecovered: this.onTrackingRecovered,
                    }}
                    initialScene={{ scene: NavigatorScene }}
                />
                <LinearGradient
                    colors={[theme.rgba(theme.grey, 1), theme.rgba(theme.grey, 0)]}
                    style={styles.gradient}
                />
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.onClose} style={{ flex: 0.1, margin: theme.scale(2) }}>
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
                <View style={styles.trackingInfo}>
                    {!trackingInitialized && <Text style={styles.statusTextYellow} numberOfLines={1}>Initializing AR...</Text>}
                    {trackingInitialized && trackingGood && <Text style={styles.statusTextGreen} numberOfLines={1}>AR tracking nominal</Text>}
                    {trackingInitialized && !trackingGood &&  <Text style={styles.statusTextRed} numberOfLines={2}>
                        AR tracking lost!
                        Point the camera on a better scene!
                    </Text>}
                </View>
                <LinearGradient
                    colors={[theme.rgba(theme.grey, 0.2), theme.rgba(theme.grey, 1)]}
                    style={styles.circle}
                />
                <TouchableOpacity onPress={() => this.setState({ modal: true })} style={styles.touchableDetail}>
                    <Icon
                        name={'map'}
                        color={theme.textAccent}
                        size={theme.scale(25)}
                        style={styles.roundNextBtn}
                    />
                </TouchableOpacity>
                <View style={styles.compassContainer}>
                    <Icon
                        name={'navigation'}
                        color={theme.textAccent}
                        size={theme.scale(40)}
                        style={[styles.roundWaypointCompass, {
                            transform: [
                                { rotateZ: `${-angle}deg` },
                            ]}]
                        }
                    />
                </View>
                <View
                    style={[
                        theme.rowAlignedCenterVertical,
                        { position: 'absolute', bottom: theme.scale(20), flex: 1, width: '100%' }
                    ]}
                >
                    {distance !== 0
                        ? (
                            <React.Fragment>
                                <Text style={styles.text}>{convertDistance(distance)}</Text>
                                <Text style={[styles.text, { fontSize: theme.scale(13) }]}>
                                    to the next point
                                </Text>
                            </React.Fragment>
                        )
                        : (
                            <Text style={[ styles.text, { marginBottom: theme.scale(15) } ]}>
                                Arrived to destination!
                            </Text>
                        )
                    }
                </View>

                <Popup visible={this.state.modal} style={styles.modal} onClose={() => this.setState({ modal: false })}>
                    <View style={theme.rowAlignedCenterVertical}>
                        <View style={styles.bar} />
                        <MapContainer
                            onSetRef={(mapRef) => this.mapRef = mapRef}
                            points={points}
                            pins={[{location: selectedPlace.location, color: theme.textAccent}]}
                            isCleanMap={true}
                            containerStyle={{ width: '100%', height: theme.scale(210) }}
                            noMoves={true}
                            onLayout={() => {
                                if (this.mapRef) {
                                    this.mapRef.animateToRegion({
                                        longitude: selectedPlace.location.lng,
                                        latitude: selectedPlace.location.lat,
                                        latitudeDelta: 0.01250270688370961,
                                        longitudeDelta: 0.01358723958820065,
                                    }, 1200);
                                    setTimeout(() => {
                                        this.mapRef.fitToCoordinates(
                                            this.props.bounds,
                                            {
                                                edgePadding: {
                                                    top: 0,
                                                    bottom: 0,
                                                    right: theme.scale(30),
                                                    left: theme.scale(30)
                                                },
                                                animated: true
                                            }
                                        );
                                    }, 1300);
                                }
                            }}
                        />
                    </View>
                </Popup>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userLocation: state.userLocation,
    directions: state.directions,
    selectedPlace: state.selectedPlace,
    bounds: state.bounds,
});
const mapDispatchToProps = dispatch => {
    return {
        cleanBounds: () => dispatch(cleanAction('bounds')),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ARNavigator);

function getStyles(theme) {
    return {
        roundWaypointCompass: {
            ...theme.rowAlignedCenterVertical,
            height: theme.scale(80),
            width: theme.scale(80),
            padding: theme.scale(10),
            backgroundColor: theme.rgba(theme.grey, 0.8),
            borderRadius: 150 / 2,
        },
        roundNextBtn: {
            ...theme.rowAlignedCenterVertical,
            height: theme.scale(65),
            width: theme.scale(65),
            padding: theme.scale(10),
            backgroundColor: theme.rgba(theme.grey, 0.8),
            borderRadius: 150 / 2,
        },
        compassContainer: {
            position: 'absolute',
            bottom: ((theme.fullWidth / 1.5) / 2) - theme.scale(35),
            alignSelf: 'center',
        },
        touchableDetail: {
            position: 'absolute',
            bottom: theme.scale(25),
            left: theme.scale(25),
        },
        touchableNext: {
            position: 'absolute',
            bottom: theme.scale(25),
            right: theme.scale(25),
        },
        primaryText: theme.textStyle({
            font: 'NunitoBold',
            color: 'textAccent',
            size: 16,
            align: 'left'
        }),
        text: theme.textStyle({
            font: 'NunitoMedium',
            color: 'textPlaceholder',
            size: 18,
            align: 'center'
        }),
        circle: {
            flex: 1,
            position: 'absolute',
            width: theme.fullWidth,
            height: theme.fullWidth,
            bottom: -(theme.fullWidth / 1.5),
            borderWidth: theme.scale(3),
            borderColor: theme.rgba(theme.textSecondary, 0.6),
            borderStyle: 'solid',
            borderRadius: theme.fullWidth / 2,
        },
        gradient: {
            flex: 1,
            width: '100%',
            height: theme.scale(250),
            position: 'absolute',
            top: 0,
        },
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
        statusTextGreen: theme.textStyle({
            font: 'NunitoBold',
            color: 'textAccent',
            size: 16,
            align: 'center',
        }),
        statusTextYellow: theme.textStyle({
            font: 'NunitoBold',
            color: 'warning',
            size: 16,
            align: 'center',
        }),
        statusTextRed: theme.textStyle({
            font: 'NunitoBold',
            color: 'error',
            size: 16,
            align: 'center',
        }),
        trackingInfo: {
            position: 'absolute',
            top: theme.scale(75),
            width: theme.fullWidth,
        },
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
        modal: {
            height: theme.scale(270),
            backgroundColor: theme.rgba(theme.grey, 0.8),
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
    }
}
