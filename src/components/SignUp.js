import React from 'react';
import {useNavigation} from '@react-navigation/native';
import getTheme from '../global/Style';
import {Input, ButtonForm} from '../components';
import API from '../global/API';
import SecureStorage from 'react-native-secure-storage';
import {Text, View} from "react-native";
import CheckBox from "@react-native-community/checkbox";

export default function SignUp() {
    const {navigate} = useNavigation();
    const theme = getTheme();
    const styles = getStyles(theme);

    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [toggleCheckBox, setToggleCheckBox] = React.useState(false);

    const onSignUp = React.useCallback(() => {
        API.registerUser({
            first_name: '123', last_name: '123', patronymic: '123',
            email, password, role: toggleCheckBox ? 'driver' : 'passenger'
        })
            .then((res) => {
                if (res && res.status === 200) {
                    SecureStorage.setItem('token', res.data.token)
                        .then(() => {
                            if (!toggleCheckBox) navigate('Home');
                            else navigate('OrderList');
                        });
                }
            });
    }, [username, email, password]);

    React.useEffect(() => {
        SecureStorage.setItem('isDriver', toggleCheckBox ? 'true' : 'false')
    }, [toggleCheckBox]);

    return (
        <>
            {/*<Input*/}
            {/*  placeholder={'Username'}*/}
            {/*  value={username}*/}
            {/*  onChange={setUsername}*/}
            {/*  rightIcon={'user'}*/}
            {/*  containerStyle={{ marginVertical: theme.scale(25) }}*/}
            {/*  dark={false}*/}
            {/*/>*/}
            <View style={styles.checkbox}>
                <CheckBox
                    disabled={false}
                    value={toggleCheckBox}
                    onValueChange={(newValue) => setToggleCheckBox(newValue)}
                />
                <Text style={styles.checkboxLabel}>Sign up as driver</Text>
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
                text={'Sign up'}
                onPress={onSignUp}
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