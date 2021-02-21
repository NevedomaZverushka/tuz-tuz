import React from 'react';
import {Text, View, ScrollView} from "react-native";
import API from "../global/API";
import SecureStorage from "react-native-secure-storage";
import {Button} from "../components";
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
                <Text>Do you want to confirm taking this order?</Text>
                <View style={{flexDirection: 'row', marginTop: theme.scale(10)}}>
                    <Button containerStyle={styles.confirmButton}
                            text={'No'}
                            buttonColor={theme.textSecondary}
                            textColor={theme.black}
                            onPress={() => navigate('OrderList')}
                    />
                    <Button containerStyle={styles.confirmButton}
                            text={'Yes'}
                            buttonColor={theme.textSecondary}
                            textColor={theme.black}
                            onPress={() => setConfirmed(true)}
                    />
                </View>
            </View>
        ) : (
            <View style={styles.container}>
                <Text>Step 1</Text>
                <Text>{userText}</Text>
                {isUserConfirmed && <>
                    <Text>Step 2</Text>
                    {!isMovingOut ?
                        <>
                            <Text>Click the button when you are ready to go</Text>
                            <Button text={'I\'m on my way!'}
                                    buttonColor={theme.textSecondary}
                                    textColor={theme.black}
                                    onPress={() => setMovingOut(true)}
                            />
                        </>
                        :
                        <Text>You've confirmed you're on your way to passenger</Text>
                    }
                    {isMovingOut && <>
                        <Text>Step 3</Text>
                        {!isInPosition ?
                            <>
                                <Text>Click the button when you are in position</Text>
                                <Button text={'I\'m in position!'}
                                        buttonColor={theme.textSecondary}
                                        textColor={theme.black}
                                        onPress={() => setInPosition(true)}
                                />
                            </>
                            :
                            <Text>You've confirmed your arrival. Wait for passenger to come.</Text>
                        }
                        {isInPosition && <>
                            <Text>Step 4</Text>
                            {!isFinished ?
                                <>
                                    <Text>Click the button if you've finished the trip.</Text>
                                    <Button text={'Finish!'}
                                            buttonColor={theme.textSecondary}
                                            textColor={theme.black}
                                            onPress={() => setFinished(true)}
                                    />
                                </>
                                :
                                <Text>You've confirmed the trip end.</Text>
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
    };
}