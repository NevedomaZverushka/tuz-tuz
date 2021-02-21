import React from 'react';
import {Text, View, ScrollView} from "react-native";
import API from "../global/API";
import SecureStorage from "react-native-secure-storage";
import {Button, Header} from "../components";
import getTheme from "../global/Style";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";

let ordersWatch = null;

export default function OrderList() {
    const theme = getTheme();
    const styles = getStyles(theme);
    const {navigate} = useNavigation();

    const [orders, setOrders] = React.useState([]);

    const refreshOrders = React.useCallback(() => {
        SecureStorage.getItem('token')
            .then(token => {
                API.getOrders(token)
                    .then((res) => {
                        if (res && res.status === 200) {
                            setOrders(res.data.orders);
                        }
                    })
                    .catch(err => console.log(err));
            });
    });

    React.useEffect(() => {
        refreshOrders();
        ordersWatch = setInterval(refreshOrders, 3000);
        return () => clearInterval(ordersWatch)
    }, []);

    return(
        <SafeAreaView style={styles.container}>
            <Header text={"Order list"} />
            <ScrollView style={styles.scrollView}>
                {orders.map((order, idx) => {
                    return <View key={idx} style={styles.orderRow}>
                        <View style={{ flex: 1, ...theme.rowAlignedVertical }}>
                            <Text numberOfLines={1}>{`From ${order.from} to ${order.to}`}</Text>
                        </View>
                        <Button containerStyle={styles.orderButton}
                            text={'View'}
                            buttonColor={theme.textPlaceholder}
                            textColor={theme.black}
                            onPress={() => navigate('OrderFlow', { order })}
                        />
                    </View>
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

function getStyles(theme) {
    return {
        scrollView: {
            backgroundColor: theme.grey,
            paddingHorizontal: theme.scale(15),
            paddingVertical: theme.scale(10)
        },
        orderRow: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            padding: theme.scale(12),
            backgroundColor: theme.white,
            marginVertical: theme.scale(10),
            borderRadius: theme.scale(5),
        },
        orderButton: {
            flex: 0.4,
            paddingHorizontal: theme.scale(0),
        },
    };
}
