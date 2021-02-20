import React from 'react';
import {useNavigation} from '@react-navigation/native';
import getTheme from '../global/Style';
import {Input, ButtonForm} from '../components';
import API from '../global/API';
import SecureStorage from 'react-native-secure-storage';

export default function SignUp(props) {
    const {navigate} = useNavigation();
    const theme = getTheme();
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const onSignUp = React.useCallback(() => {
        API.registerUser({
            first_name: '123', last_name: '123', patronymic: '123',
            email, password, role: 'passenger'
        })
            .then((res) => {
                if (res && res.status === 200) {
                    props.onSignedUp()
                }
            });
    }, [username, email, password]);

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
