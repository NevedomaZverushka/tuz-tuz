import React from 'react';
import {Text, View, ScrollView} from "react-native";
import API from "../global/API";
import SecureStorage from "react-native-secure-storage";
import {Button, Icon} from "../components";
import getTheme from "../global/Style";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";

export default function OrderFlow(props) {
    const theme = getTheme();
    const styles = getStyles(theme);
    const {navigate} = useNavigation();
    const {order} = props.route.params;
    const [isConfirmed, setConfirmed] = React.useState(false);
    const [isUserConfirmed, setUserConfirmed] = React.useState(true);
    const [isMovingOut, setMovingOut] = React.useState(false);
    const [isInPosition, setInPosition] = React.useState(false);
    const [isFinished, setFinished] = React.useState(false);


    console.log(order);
    // const refreshOrders = React.useCallback(() => {
    //     SecureStorage.getItem('token')
    //         .then(token => {
    //             API.getOrders(token)
    //                 .then((res) => {
    //                     if (res && res.status === 200) {
    //                         setOrders(res.data.orders);
    //                     }
    //                 });
    //         });
    // });

    React.useEffect(() => {

    }, []);

    // TODO Add user confirmation poll
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
                            onPress={() => setConfirmed(true)}
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
                                    onPress={() => setMovingOut(true)}
                                    containerStyle={{ marginTop: theme.scale(20) }}
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
                                <Text>Click the button when you are in position</Text>
                                <Button text={'I\'m in position!'}
                                        buttonColor={theme.textSecondary}
                                        textColor={theme.black}
                                        onPress={() => setInPosition(true)}
                                        containerStyle={{ marginTop: theme.scale(20) }}
                                />
                            </>
                            :
                            <Text style={styles.textSecondary}>You've confirmed your arrival. Wait for passenger to come.</Text>
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
                                    <Text style={styles.textSecondary}>Click the button if you've finished the trip.</Text>
                                    <Button text={'Finish!'}
                                        buttonColor={theme.textSecondary}
                                        textColor={theme.black}
                                        onPress={() => setFinished(true)}
                                        containerStyle={{ marginTop: theme.scale(20) }}
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
                                        containerStyle={{ marginTop: theme.scale(20) }}
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
            { marginBottom: theme.scale(40) }
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
            { marginVertical: theme.scale(10) }
        ]
    };
}
