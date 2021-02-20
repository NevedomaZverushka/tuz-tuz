import React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import style from '../assets/map/style';
import styleClean from '../assets/map/styleClean';
import getTheme from "../global/Style";

export default function MapContainer(props) {
    const {
        fullscreen = true,
        onSetRef = () => {},
        pins = [], onPinClick,
        points = [],
        onPress = () => {},
        isCleanMap = false,
        containerStyle = {},
        onLayout = () => {},
        noMoves = false,
    } = props;
    const theme = getTheme();

    const markers = React.useMemo(() => {
        return pins.map((pin, idx) => {
            const { color, location } = pin;
            return(
                <Marker
                    onPress={() => onPinClick(pin.placeId)}
                    pinColor={color}
                    coordinate={{ latitude: location.lat, longitude: location.lng }}
                    key={idx}
                />
            )
        });
    }, [pins]);

    //console.log(points);
    return(
        <MapView
            ref={(map) => onSetRef(map)}
            showsUserLocation={true}
            showsMyLocationButton={false}
            provider={PROVIDER_GOOGLE}
            onPress={onPress}
            onLayout={onLayout}
            initialRegion={{
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            }}
            style={[fullscreen && { height: '100%' }, containerStyle]}
            customMapStyle={isCleanMap ? styleClean : style}
            pitchEnabled={!noMoves}
            rotateEnabled={!noMoves}
            zoomEnabled={!noMoves}
            scrollEnabled={!noMoves}
        >
            {markers}
            {points.length !== 0 && (
                <Polyline
                    coordinates={points}
                    strokeColor={theme.rgba(theme.textAccent, 0.5)}
                    strokeWidth={6}
                />
            )}
        </MapView>
    )
}
