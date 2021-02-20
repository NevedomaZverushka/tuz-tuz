import {useDispatch, useSelector} from "react-redux";
import * as React from "react";
import SecureStorage from "react-native-secure-storage";
import API from "../global/API";
import {setAction} from "../store";
import {useNavigation} from "@react-navigation/native";

export default function Splash() {

    const {navigate} = useNavigation();
    const dispatch = useDispatch();
    const status = useSelector(state => state.appReady);

    React.useEffect(() => {
        if (status) {
            navigate('AR');
        }
        // SecureStorage.getItem('token')
        //     .then(token => {
        //         API.getMe(token)
        //             .then(res => {
        //                 if (res && res.status === 200) {
        //                     dispatch(setAction('user', res.data.user));
        //                     navigate('Home')
        //                 }
        //             })
        //             .catch(err => {
        //                 if (err && err.response) {
        //                     if (err.response.status === 400 || err.response.status === 401) {
        //                         navigate('Auth');
        //                     } else {
        //                         console.log(err.response.data, err.response.status);
        //                     }
        //                 }
        //             })
        //         }
        //     );
    }, [status]);
    return null;
}


