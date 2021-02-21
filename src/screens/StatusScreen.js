import React from 'react';
import {View, Text, TouchableOpacity, ImageBackground} from "react-native";
import getTheme from "../global/Style";
import {Button, ButtonForm, Icon, Popup} from "../components";
import SecureStorage from "react-native-secure-storage";
import API from "../global/API";
import {API_URL} from "@env";
import {useNavigation} from "@react-navigation/native";

const Choose = (props) => {
    const {theme, styles, agreements} = props;

    const [driver, setDriver] = React.useState(null);

    // const agreement = agreements[0];
    // SecureStorage.getItem('token')
    //     .then(token => {
    //         API.selectAgreement(agreement.id, token)
    //             .then(() => {/* Установить следующий шаг */})
    //     });

    return (
        <React.Fragment>
            <Text style={styles.textStep}>Step 1</Text>
            <Text style={[styles.textStatus, { marginBottom: theme.scale(10) }]}>Status: choosing your driver</Text>
            {agreements.map((agreement, idx) => {
                return(
                    <TouchableOpacity style={styles.orderRow} onPress={() => setDriver(agreement.driver)} key={idx}>
                        <Text style={[styles.subtitle2, { flex: 1 }]}>
                            {`${agreement.driver.firstName} ${agreement.driver.lastName}`}
                        </Text>
                        <Button
                            containerStyle={styles.orderButton}
                            text={'Select'}
                            buttonColor={theme.textPlaceholder}
                            textColor={theme.black}
                            onPress={() => {}}
                        />
                    </TouchableOpacity>
                );
            })}
            <Popup visible={driver !== null} style={styles.modal} onClose={() => setDriver(null)}>
                <View style={[{ flex: 0.8 }, theme.rowAlignedCenterVertical]}>
                    <Text style={styles.subtitle}>
                        Driver
                    </Text>
                    <Text style={styles.title} numberOfLines={1}>
                        {`${driver?.firstName} ${driver?.lastName}`}
                    </Text>
                </View>
                <ImageBackground
                    style={styles.image}
                    source={{ uri: `${API_URL}/public/${driver?.carImage}` }}
                    resizeMode={"cover"}
                />
            </Popup>
        </React.Fragment>
    )
};

const Waiting = (props) => {
    const { theme, styles, order } = props;
    const { navigate } = useNavigation();
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
                        console.log('ello');
                        navigate('AR');
                    }}
                    containerStyle={{marginTop: theme.scale(40)}}
                />
            )}
            <ButtonForm
                text={'Want to play game?'}
                onPress={() => navigate('Game')}
                containerStyle={{marginTop: theme.scale(40)}}
            />
        </React.Fragment>
    );
};

const Trip = (props) => {
    const { theme, styles } = props;
    const { navigate } = useNavigation();
    return(
        <React.Fragment>
            <Text style={styles.textStep}>Step 3</Text>
            <Text style={styles.textStatus}>Status: in progress</Text>
            <ButtonForm
                text={'Want to play again?'}
                onPress={() => navigate('Game')}
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
                <Choose theme={theme} styles={styles} agreements={agreements}/>
            )}
            {statuses.waiting.status && (
                <Waiting styles={styles} theme={theme} order={order}/>
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
        orderRow: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: theme.scale(12),
            backgroundColor: theme.white,
            marginVertical: theme.scale(10),
            borderRadius: theme.scale(5),
            borderWidth: theme.scale(3),
            borderColor: theme.textPrimary,
            borderStyle: 'solid',
            paddingHorizontal: theme.scale(10),
        },
        orderButton: {
            display: "flex",
            flex: 0.4,
            paddingHorizontal: theme.scale(0),
        },
        image: {
            width: "100%",
            height: theme.scale(150)
        },
        modal: {
            height: theme.scale(250),
            backgroundColor: theme.rgba(theme.grey, 0.8),
            borderTopLeftRadius: theme.scale(20),
            borderTopRightRadius: theme.scale(20),
            paddingTop: theme.scale(20),
            paddingHorizontal: theme.scale(20),
        },
        title: theme.textStyle({
            size: 18,
            font: 'NunitoBold',
            color: 'white',
            align: 'center'
        }),
        subtitle2: theme.textStyle({
            size: 14,
            font: 'NunitoMedium',
            color: 'background',
            align: 'left'
        }),
        subtitle: theme.textStyle({
            size: 14,
            font: 'NunitoMedium',
            color: 'background',
            align: 'center'
        }),
    }
}
