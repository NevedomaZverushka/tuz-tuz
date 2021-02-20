import React from 'react';
import {useNavigation} from '@react-navigation/native';
import SecureStorage from 'react-native-secure-storage';
import getTheme from '../global/Style';
import {Input, ButtonForm} from '../components';
import API from '../global/API';
import {Text, View} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import {useDispatch} from "react-redux";

export default function Login() {
    const {navigate} = useNavigation();
    const theme = getTheme();
    const styles = getStyles(theme);
    const dispatch = useDispatch();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [toggleCheckBox, setToggleCheckBox] = React.useState(false);

    const onLogIn = React.useCallback(() => {
        API.loginUser({email, password})
            .then(res => {
                if (res && res.status === 200) {
                    SecureStorage.setItem('token', res.data.token)
                        .then(() => {
                            if (!toggleCheckBox) navigate('Home');
                            else navigate('OrderList');
                        });
                }
            });
    }, [email, password, toggleCheckBox]);

    return (
        <>
            <View style={styles.checkbox}>
                <CheckBox
                    disabled={false}
                    value={toggleCheckBox}
                    onValueChange={(newValue) => setToggleCheckBox(newValue)}
                />
                <Text style={styles.checkboxLabel}>Log in as driver</Text>
            </View>
            <Input
                placeholder={'Email'}
                value={email}
                onChange={setEmail}
                rightIcon={'email-outline'}
                containerStyle={{marginVertical: theme.scale(25)}}
                dark={false}
            />
            <Input
                placeholder={'Password'}
                value={password}
                onChange={setPassword}
                secureTextEntry={true}
                containerStyle={{marginVertical: theme.scale(25)}}
                dark={false}
            />
            <ButtonForm
                text={'Log in'}
                onPress={onLogIn}
                containerStyle={{marginTop: theme.scale(40)}}
            />
        </>
    );
};

function getStyles(theme) {
    return {
        checkbox: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%"
        },
        checkboxLabel: theme.textStyle({
            font: 'NunitoBold',
            color: 'grey',
            size: 14,
            align: 'left'
        }),
    };
}