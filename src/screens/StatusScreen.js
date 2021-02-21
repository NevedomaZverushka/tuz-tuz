import React from 'react';
import {View, Text, TouchableOpacity} from "react-native";
import getTheme from "../global/Style";
import {ButtonForm, Icon} from "../components";
import SecureStorage from "react-native-secure-storage";
import API from "../global/API";

const Choose = (props) => {
    const {theme, styles, agreements} = props;

    // const agreement = agreements[0];
    // SecureStorage.getItem('token')
    //     .then(token => {
    //         API.selectAgreement(agreement.id, token)
    //             .then(() => {/* Установить следующий шаг */})
    //     });

    return (
        <React.Fragment>
            <Text style={styles.textStep}>Step 1</Text>
            <Text style={styles.textStatus}>Status: choosing your driver</Text>
            {agreements.map((agreement, idx) => {
                return <Text key={idx}>{`${agreement.driver.firstName} ${agreement.driver.lastName}`}</Text>;
            })}
        </React.Fragment>
    )
};

const Waiting = (props) => {
    const {theme, styles} = props;
    const [text, setText] = React.useState("");

    React.useEffect(() => {
        setTimeout(() => {
            setText("Car is already on place!")
        }, 20000);
    }, []);

    return (
        <React.Fragment>
            <Text style={styles.textStep}>Step 2</Text>
            <Text style={styles.textStatus}>Status: waiting for car</Text>
            <Text style={styles.info}>{text === "" ? "Car will be in 10 minutes" : text}</Text>
            {text !== "" && (
                <ButtonForm
                    text={'Want to open AR?'}
                    onPress={() => {
                    }}
                    containerStyle={{marginTop: theme.scale(40)}}
                />
            )}
            <ButtonForm
                text={'Want to play a game?'}
                onPress={() => {
                }}
                containerStyle={{marginTop: theme.scale(40)}}
            />
        </React.Fragment>
    );
};

const Trip = (props) => {
    const {theme, styles} = props;
    return (
        <React.Fragment>
            <Text style={styles.textStep}>Step 3</Text>
            <Text style={styles.textStatus}>Status: in progress</Text>
            <ButtonForm
                text={'Want to play game?'}
                onPress={() => {
                }}
                containerStyle={{marginTop: theme.scale(200)}}
            />
        </React.Fragment>
    )
};

const End = (props) => {
    const {theme, styles} = props;
    return (
        <React.Fragment>
            <Text style={styles.textStep}>Step 4</Text>
            <Text style={styles.textStatus}>Status: yeah, you are on place</Text>
            <Text style={styles.info}>Please, leave review</Text>
            <ButtonForm
                text={'It was good :)'}
                onPress={() => {
                }}
                containerStyle={{marginTop: theme.scale(40)}}
            />
            <ButtonForm
                text={'It was bad :('}
                onPress={() => {
                }}
                containerStyle={{marginTop: theme.scale(40)}}
            />
        </React.Fragment>
    )
};

let agreementsWatch = null;

export default function StatusScreen(props) {
    const theme = getTheme();
    const styles = getStyles(theme);
    const {order} = props.route.params;
    const [agreements, setAgreements] = React.useState([]);
    const [driver, setDriver] = React.useState(null);

    const refreshAgreements = React.useCallback(() => {
        SecureStorage.getItem('token')
            .then(token => {
                API.getAgreements(order.id, token)
                    .then((res) => {
                        if (res && res.status === 200) {
                            setAgreements(res.data.agreements);
                        }
                    })
                    .catch(err => {
                        if (err.response && err.response.data.error === 'Driver has already found') {
                            setStatuses({
                                ...statuses,
                                choose: {status: false},
                                waiting: {status: true, icon: "car"},
                            })
                        } else {
                            console.log(err)
                        }
                    });
            });
    });

    React.useEffect(() => {
        refreshAgreements();
        agreementsWatch = setInterval(refreshAgreements, 3000);
        return () => clearInterval(agreementsWatch)
    }, []);

    const [statuses, setStatuses] = React.useState({
        choose: {status: true, icon: "form-select"},
        waiting: {status: false, icon: "car"},
        trip: {status: false, icon: "road-variant"},
        end: {status: false, icon: "star"},
    });

    return (
        <View style={styles.container}>
            <View style={[theme.rowAlignedCenterVertical, {marginBottom: theme.scale(10)}]}>
                <Icon
                    name={(Object.values(statuses).filter(status => status.status))[0].icon}
                    color={theme.textPrimary}
                    size={theme.scale(70)}
                />
            </View>
            {statuses.choose.status && (
                <Choose styles={styles} agreements={agreements}/>
            )}
            {statuses.waiting.status && (
                <Waiting styles={styles} theme={theme}/>
            )}
            {statuses.trip.status && (
                <Trip styles={styles} theme={theme}/>
            )}
            {statuses.end.status && (
                <End styles={styles} theme={theme}/>
            )}
        </View>
    )
};

function getStyles(theme) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.white,
            paddingVertical: theme.scale(30),
            paddingHorizontal: theme.scale(25)
        },
        textStep: theme.textStyle({
            font: 'NunitoBold',
            color: 'textPrimary',
            size: 18,
            align: 'center'
        }),
        textStatus: theme.textStyle({
            font: 'NunitoBold',
            color: 'background',
            size: 16,
            align: 'center'
        }),
        info: [
            {marginTop: theme.scale(180)},
            theme.textStyle({
                font: 'NunitoBold',
                color: 'grey',
                size: 24,
                align: 'center'
            })
        ],
    }
}
