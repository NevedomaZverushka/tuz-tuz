import React from 'react';
import {useNavigation} from '@react-navigation/native';
import SecureStorage from 'react-native-secure-storage';
import getTheme from '../global/Style';
import {Input, ButtonForm} from '../components';
import API from '../global/API';

export default function Login() {
    const {navigate} = useNavigation();
    const theme = getTheme();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const onLogIn = React.useCallback(() => {
        API.loginUser({email, password})
            .then(res => {
                if (res && res.status === 200) {
                    SecureStorage.setItem('token', res.data.token)
                        .then(() => {
                            navigate('Home');
                        });
                }
            });
    }, [email, password]);

    return (
        <>
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
