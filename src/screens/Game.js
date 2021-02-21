import React from 'react';
import { ActivityIndicator, View, Text } from "react-native";
import { PicturePuzzle } from 'react-native-picture-puzzle';
import getTheme from "../global/Style";
import {Button} from "../components";
import {useNavigation} from "@react-navigation/native";

export default function Game() {
    const theme = getTheme();
    const styles = getStyles(theme);
    const { goBack } = useNavigation();

    const [hidden, setHidden] = React.useState(0); // piece to obscure
    const [pieces, setPieces] = React.useState([0, 1, 2, 3, 4, 6, 5, 7, 8]);

    const source = React.useMemo(() => ({
        uri: 'https://i1.wp.com/itc.ua/wp-content/uploads/2019/05/Uklon-1.jpg',
    }), []);
    const finish = React.useMemo(() => {
        const temp = [...pieces];
        return pieces === temp.sort();
    }, [pieces]);

    const renderLoading = React.useCallback(() => <ActivityIndicator />, []);
    const onChange = React.useCallback((nextPieces, nextHidden) => {
        setPieces([...nextPieces]);
        setHidden(nextHidden);
    }, [setPieces, setHidden]);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Puzzle</Text>
            <Text style={styles.secondary}>It's time to play while you wait for the driver!</Text>
            <PicturePuzzle
                size={500}
                pieces={pieces}
                hidden={hidden}
                onChange={onChange}
                source={source}
                renderLoading={renderLoading}
            />
            {finish && (
                <>
                    <Text style={styles.title}>Congratulations!</Text>
                </>
            )}
            <Button text={'Back to trip'}
                buttonColor={theme.textSecondary}
                textColor={theme.black}
                onPress={() => goBack()}
                containerStyle={{ marginTop: theme.scale(40) }}
            />
        </View>
    );
}

function getStyles(theme) {
    return {
        container: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            height: "100%",
            paddingVertical: theme.scale(50),
        },
        title: [
            theme.textStyle({
                font: 'NunitoBold',
                color: 'textPrimary',
                size: 18,
                align: 'center'
            }),
            { marginBottom: theme.scale(10) }
        ],
        secondary: [
            theme.textStyle({
                font: 'NunitoMedium',
                color: 'grey',
                size: 16,
                align: 'center'
            }),
            { marginBottom: theme.scale(10) }
        ],
    };
}
