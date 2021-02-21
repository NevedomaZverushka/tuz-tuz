import React from 'react';
import {Text, View} from "react-native";
import {Button, Icon} from "../components";
import getTheme from "../global/Style";
import {useNavigation} from "@react-navigation/native";
import SecureStorage from "react-native-secure-storage";
import API from "../global/API";

let ordersWatch = null;

export default function OrderFlow(props) {
    const theme = getTheme();
    const styles = getStyles(theme);
    const {navigate} = useNavigation();
    const {order} = props.route.params;

    const [isConfirmed, setConfirmed] = React.useState(false);
    const [isUserConfirmed, setUserConfirmed] = React.useState(false);
    const [isMovingOut, setMovingOut] = React.useState(false);
    const [isInPosition, setInPosition] = React.useState(false);
    const [isFinished, setFinished] = React.useState(false);

    const refreshOrders = React.useCallback(() => {
        SecureStorage.getItem('token')
            .then(token => {
                API.currentAgreement(token)
                    .then((res) => {
                        if (res && res.status === 200) {
                            if (res.data.status === 'accepted') {
                                setUserConfirmed(true);
                            }
                        }
                    })
                    .catch(err => {
                        if (err.response && err.response.data.error === 'You have no current agreement') {
                            // Do nothing
                        } else {
                            console.log(err)
                        }
                    });
            });
    });

    React.useEffect(() => {
        refreshOrders();
        ordersWatch = setInterval(refreshOrders, 3000);
        return () => clearInterval(ordersWatch)
    }, []);

    let userText = isUserConfirmed ? 'User confirmed your offer' : 'Awaiting passenger confirmation...';

    return <View>
        {!isConfirmed ? (
            <View style={styles.container}>
                <Icon
                    name={"clock-time-five-outline"}
                    color={theme.textPrimary}
                    size={theme.scale(70)}
                />
                <Text style={styles.textStep}>Do you want to confirm taking this order?</Text>
                <View style={{flexDirection: 'row', marginTop: theme.scale(10)}}>
                    <Button containerStyle={styles.confirmButton}
                            text={'No'}
                            buttonColor={theme.textSecondary}
                            textColor={theme.background}
                            onPress={() => navigate('OrderList')}
                    />
                    <Button containerStyle={styles.confirmButton}
                            text={'Yes'}
                            buttonColor={theme.textSecondary}
                            textColor={theme.background}
                            onPress={() => {
                                SecureStorage.getItem('token')
                                    .then(token => {
                                        API.addAgreement(order.id, token)
                                            .then(() => setConfirmed(true))
                                            .catch(err => console.log(err));
                                    });
                            }}
                    />
                </View>
            </View>
        ) : (
            <View style={styles.container}>
                <Icon
                    name={"source-commit-start"}
                    size={theme.scale(35)}
                    color={theme.background}
                />
                <Text style={styles.textStatus}>Step 1</Text>
                <Text style={styles.textSecondary}>{userText}</Text>
                <Icon
                    name={"source-commit"}
                    size={theme.scale(35)}
                    color={theme.background}
                />
                {isUserConfirmed && <>
                    <Text style={styles.textStatus}>Step 2</Text>
                    {!isMovingOut ?
                        <>
                            <Text style={styles.textSecondary}>Click the button when you are ready to go</Text>
                            <Button text={'I\'m on my way!'}
                                    buttonColor={theme.textSecondary}
                                    textColor={theme.black}
                                    onPress={() => {
                                        SecureStorage.getItem('token')
                                        .then(token => {
                                            API.setOrderDone(order.id, token)
                                                .then(() => setMovingOut(true))
                                                .catch(err => console.log(err));
                                        });
                                    }}
                                    containerStyle={{marginTop: theme.scale(20)}}
                            />
                        </>
                        :
                        <Text style={styles.textSecondary}>You've confirmed you're on your way to passenger</Text>
                    }
                    {isMovingOut && <>
                        <Icon
                            name={"source-commit"}
                            size={theme.scale(35)}
                            color={theme.background}
                        />
                        <Text style={styles.textStatus}>Step 3</Text>
                        {!isInPosition ?
                            <>
                                <Text style={styles.textStep}>Click the button when you are in position</Text>
                                <Button text={'I\'m in position!'}
                                        buttonColor={theme.textSecondary}
                                        textColor={theme.black}
                                        onPress={() => setInPosition(true)}
                                        containerStyle={{marginTop: theme.scale(20)}}
                                />
                            </>
                            :
                            <Text style={styles.textSecondary}>You've confirmed your arrival. Wait for passenger to
                                come.</Text>
                        }
                        {isInPosition && <>
                            <Icon
                                name={"source-commit"}
                                size={theme.scale(35)}
                                color={theme.background}
                            />
                            <Text style={styles.textStatus}>Step 4</Text>
                            {!isFinished ?
                                <>
                                    <Text style={styles.textSecondary}>Click the button if you've finished the
                                        trip.</Text>
                                    <Button text={'Finish!'}
                                            buttonColor={theme.textSecondary}
                                            textColor={theme.black}
                                            onPress={() => {
                                                SecureStorage.getItem('token')
                                                    .then(token => {
                                                        API.setOrderDone(order.id, token)
                                                            .then(() => setFinished(true))
                                                            .catch(err => console.log(err));
                                                    });

                                            }}
                                            containerStyle={{marginTop: theme.scale(20)}}
                                    />
                                </>
                                :
                                <>
                                    <Text style={styles.textSecondary}>You've confirmed the trip end.</Text>
                                    <Icon
                                        name={"source-commit-end"}
                                        size={theme.scale(35)}
                                        color={theme.background}
                                    />
                                    <Button text={'Return to orders'}
                                            buttonColor={theme.textSecondary}
                                            textColor={theme.black}
                                            onPress={() => navigate('OrderList')}
                                            containerStyle={{marginTop: theme.scale(20)}}
                                    />
                                </>
                            }
                        </>}
                    </>}
                </>}
            </View>
        )}
    </View>;
}

function getStyles(theme) {
    return {
        container: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: theme.scale(12),
        },
        confirmButton: {
            //flex: 1,
            marginHorizontal: theme.scale(10),
        },
        textStep: [
            theme.textStyle({
                font: 'NunitoBold',
                color: 'textPrimary',
                size: 18,
                align: 'center'
            }),
            {marginBottom: theme.scale(40)}
        ],
        textStatus: theme.textStyle({
            font: 'NunitoBold',
            color: 'textPrimary',
            size: 18,
            align: 'center'
        }),
        textSecondary: [
            theme.textStyle({
                font: 'NunitoMedium',
                color: 'grey',
                size: 16,
                align: 'center'
            }),
            {marginVertical: theme.scale(10)}
        ]
    };
}
