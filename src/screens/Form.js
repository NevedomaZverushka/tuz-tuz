import React from 'react';
import {View} from "react-native";
import getTheme from "../global/Style";
import {Header, MapContainer, Input} from "../components";
import {useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";

const InputBlock = (props) => {
    const { style, theme, label } = props;
    const [coordsMode, setCoordsMode] = React.useState(false);

    if (coordsMode) {
        return null;
    }
    else {
        return(
            <View style={theme.rowAlignedBetweenStretch}>
                <Input placeholder={label} />

            </View>
        )
    }
};

export default function Form() {
    const theme = getTheme();
    const styles = getStyles(theme);
    const {navigate} = useNavigation();
    const {userLocation, selectedPlace} = useSelector(state => state);

    const [points, setPoints] = React.useState([]);
    const [mapRef, setMapRef] = React.useState(null);
    const [pins, setPins] = React.useState([]);

    React.useEffect(() => {
        const { location } = selectedPlace;
        if (location.lat && location.lng) {
            mapRef && mapRef.animateToRegion({
                longitude: location.lng,
                latitude: location.lat,
                latitudeDelta: 0.01250270688370961,
                longitudeDelta: 0.01358723958820065,
            }, 1200);
            setPins(prev => [
                ...prev,
                { location: { lat: location.lat, lng: location.lng }, color: theme.textPrimary }
            ]);
        }
    }, [selectedPlace, mapRef]);

    return(
        <View style={styles.container}>
            {}
            <Header
                subtext={`Drive to`}
                text={selectedPlace.name}
                leftIcon={"arrow-back"}
                onClickLeftIcon={() => navigate('Home')}
            />
            <MapContainer
                onSetRef={(ref) => setMapRef(ref)}
                points={points}
                pins={pins}
                containerStyle={{ width: '100%', height: theme.scale(210) }}
            />
            <View style={styles.form}>
                <InputBlock
                    theme={theme}
                    style={styles}
                    label={"Start point"}
                />
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
            ...theme.rowAlignedBetweenVertical,
            paddingHorizontal: theme.scale(10)
        }
    }
}
