import React from 'react';
import getTheme from '../global/Style';
import { Text, View, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Header, Button } from '../components';
import SecureStorage from 'react-native-secure-storage';
import API from "../global/API";

export default function Profile() {
    const theme = getTheme();
    const styles = getStyles(theme);
    const { navigate } = useNavigation();
    const onLogout = React.useCallback(() => {

        SecureStorage.getItem('token')
            .then(token => API.logout(token)
                .then(res => {
                    if (res && res.status === 200) {
                        SecureStorage.removeItem('token')
                            .then(() => {
                                navigate('Auth');
                            });
                    }
                })
            );
    }, []);
    return(
        <>
            <Header rightIcon={'close'} onClickRightIcon={() => navigate('Home')} />
            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>User profile</Text>
                    <Text style={styles.subtitle}>App settings</Text>
                    <Text style={styles.subtitle}>Edit profile</Text>
                </ScrollView>
                <Button
                    text={'Log out'}
                    containerStyle={styles.button}
                    onPress={onLogout}
                />
            </View>
        </>
    );
}

function getStyles(theme) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.textPrimary,
        },
        scrollView: {
            paddingHorizontal: theme.scale(40),
        },
        title: [
            theme.textStyle({
                size: 30,
                font: 'NunitoBold',
                color: 'white',
                align: 'left'
            }),
            {
                marginVertical: theme.scale(20)
            }
        ],
        subtitle: theme.textStyle({
            size: 24,
            font: 'NunitoMedium',
            color: 'white',
            align: 'left'
        }),
        button: {
            marginHorizontal: theme.scale(40),
            marginVertical: theme.scale(20)
        }
    };
}
