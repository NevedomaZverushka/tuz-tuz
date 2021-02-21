import React from 'react';
import {View, Text, TouchableOpacity} from "react-native";
import getTheme from "../global/Style";
import {ButtonForm, Icon} from "../components";
import {useNavigation} from "@react-navigation/native";

const Choose = (props) => {
    const { theme, styles } = props;
    return(
        <React.Fragment>
            <Text style={styles.textStep}>Step 1</Text>
            <Text style={styles.textStatus}>Status: choosing driver</Text>
        </React.Fragment>
    )
};

const Waiting = (props) => {
    const { theme, styles } = props;
    const { navigate } = useNavigation();
    const [text, setText] = React.useState("");
    React.useEffect(() => {
        setTimeout(() => {
            setText("Car is already on place!")
        }, 20000);
    }, []);
    return(
        <React.Fragment>
            <Text style={styles.textStep}>Step 2</Text>
            <Text style={styles.textStatus}>Status: waiting for car</Text>
            <Text style={styles.info}>{text === "" ? "Car will be in 10 minutes" :  text}</Text>
            {text !== "" && (
                <ButtonForm
                    text={'Want to open AR?'}
                    onPress={() => {}}
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
    const { theme, styles } = props;
    return(
        <React.Fragment>
            <Text style={styles.textStep}>Step 4</Text>
            <Text style={styles.textStatus}>Status: yeah, you are on place</Text>
            <Text style={styles.info}>Please, leave review</Text>
            <ButtonForm
                text={'It was good :)'}
                onPress={() => {}}
                containerStyle={{marginTop: theme.scale(40)}}
            />
            <ButtonForm
                text={'It was bad :('}
                onPress={() => {}}
                containerStyle={{marginTop: theme.scale(40)}}
            />
        </React.Fragment>
    )
};

export default function StatusScreen() {
    const theme = getTheme();
    const styles = getStyles(theme);

    const [statuses, setStatuses] = React.useState({
        choose: { status: false, icon: "form-select"},
        waiting: { status: false, icon: "car"},
        trip: { status: false, icon: "road-variant"},
        end: { status: true, icon: "star"},
    });

    return(
        <View style={styles.container}>
            <View style={[theme.rowAlignedCenterVertical, { marginBottom: theme.scale(10) }]}>
                <Icon
                    name={(Object.values(statuses).filter(status => status.status))[0].icon}
                    color={theme.textPrimary}
                    size={theme.scale(70)}
                />
            </View>
            {statuses.choose.status && (
                <Choose styles={styles} />
            )}
            {statuses.waiting.status && (
                <Waiting styles={styles} theme={theme} />
            )}
            {statuses.trip.status && (
                <Trip styles={styles} theme={theme} />
            )}
            {statuses.end.status && (
                <End styles={styles} theme={theme} />
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
            { marginTop: theme.scale(180) },
            theme.textStyle({
                font: 'NunitoBold',
                color: 'grey',
                size: 24,
                align: 'center'
            })
        ],
    }
}
