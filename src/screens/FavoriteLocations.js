import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import getTheme from "../global/Style";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from "../components";
import { useNavigation } from '@react-navigation/native';
import {setAction} from "../store";
import { useDispatch } from 'react-redux';

const Separator = () => {
    const theme = getTheme();
    return(
        <View style={{ width: '100%', height: theme.scale(20)}} />
    )
};

export default function FavoriteLocations() {
    const theme = getTheme();
    const styles = getStyles(theme);
    const { navigate } = useNavigation();
    const dispatch = useDispatch();

    const [favorites, setFavorites] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const onDeselectFavoriteLocation = React.useCallback((favorite) => {
        let temp = favorites.filter(item => item !== favorite);
        AsyncStorage.setItem('@favorites', JSON.stringify(temp)).then(() => setFavorites(temp));
    }, [favorites]);
    const onMoveToFavorite = React.useCallback((placeId) => {
        dispatch(setAction('place', { placeId }));
        navigate('Home');
    }, [favorites]);

    React.useEffect(() => {
        AsyncStorage.getItem('@favorites')
            .then(data => {
                if (data) setFavorites(JSON.parse(data));
                setLoading(false);
            });
    }, []);

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigate('Home')} style={{ flex: 0.15 }}>
                    <Icon
                        name={'arrow-back'}
                        color={theme.textAccent}
                        size={theme.scale(22)}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}>Favorite locations</Text>
            </View>
            <ScrollView style={{ paddingHorizontal: theme.scale(20) }}>
                {(!loading && favorites.length === 0) && (
                    <Text style={styles.secondaryPlaceholder}>No favorite locations</Text>
                )}
                {favorites.map((favorite, idx) => {
                    return(
                        <React.Fragment key={idx}>
                            <View style={theme.rowAlignedBetween}>
                                <TouchableOpacity
                                    style={{ flex: 0.1 }}
                                    onPress={() => onDeselectFavoriteLocation(favorite)}
                                >
                                    <Icon
                                        name={'star'}
                                        color={theme.textAccent}
                                        size={theme.scale(22)}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => onMoveToFavorite(favorite.placeId)}
                                    style={{ flex: 0.9 }}
                                >
                                    <Text
                                        style={styles.placeText}
                                        numberOfLines={2}
                                        ellipsizeMode='tail'
                                    >
                                        {favorite.address}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Separator />
                        </React.Fragment>
                    )
                })}
            </ScrollView>
        </View>
    )
}

function getStyles(theme) {
    return {
        container: {
            ...theme.fullScreen,
            flex: 1,
            backgroundColor: theme.black,
        },
        header: {
            ...theme.rowAlignedBetween,
            paddingVertical: theme.scale(10),
            paddingHorizontal: theme.scale(20),
            height: theme.scale(60),
        },
        headerText: [
            theme.textStyle({
                font: 'NunitoMedium',
                color: 'textAccent',
                size: 16,
                align: 'center'
            }),
            {
                flex: 0.9,
                paddingRight: theme.scale(30)
            }
        ],
        placeText: theme.textStyle({
            font: 'NunitoRegular',
            color: 'textPlaceholder',
            size: 14,
            align: 'left'
        }),
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
    }
}
