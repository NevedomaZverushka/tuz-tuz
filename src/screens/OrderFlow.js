import React from 'react';
import {Text, View, ScrollView} from "react-native";
import API from "../global/API";
import SecureStorage from "react-native-secure-storage";
import {Button} from "../components";
import getTheme from "../global/Style";
import {SafeAreaView} from "react-native-safe-area-context";

let ordersWatch = null;

export default function OrderFlow() {
    const theme = getTheme();
    const styles = getStyles(theme);
    const [isConfirmed, setConfirmed] = React.useState(false);

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
        refreshOrders();
        ordersWatch = setInterval(refreshOrders, 3000);
        return () => clearInterval(ordersWatch)
    }, []);

    return <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
            {orders.map((order, idx) => {
                return <View key={idx} style={styles.orderRow}>
                    <Text style={{flex: 1}}>{`From ${order.from} to ${order.to}`}</Text>
                    <Button containerStyle={styles.orderButton}
                            text={'Select'}
                            buttonColor={theme.textSecondary}
                            textColor={theme.black}
                    />
                </View>
            })}
        </ScrollView>
    </SafeAreaView>;
}

function getStyles(theme) {
    return {
        orderRow: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            padding: theme.scale(12),
        },
        orderButton: {
            flex: 0.4,
            paddingHorizontal: theme.scale(0),
        },
    };
}