import LottieView from "lottie-react-native";
import {View} from 'react-native';
import React from 'react';
import getTheme from '../global/Style';

export default function Spinner(props) {
  const theme = getTheme();
  const styles = getStyles(theme);
  const { background } = props;
  return(
    <View style={[styles.container, { backgroundColor: background || theme.white }]}>
      {/*<LottieView*/}
      {/*  autoPlay loop*/}
      {/*  source={require('../assets/animations/spinner.json')}*/}
      {/*  style={styles.spinner}*/}
      {/*/>*/}
    </View>
  );
};

function getStyles(theme) {
  return {
    container: {
      flex: 1,
      ...theme.rowAlignedCenterVertical,
      paddingHorizontal: theme.scale(50),
      paddingVertical: theme.scale(60)
    },
    spinner: {
      width: '60%',
      height: '60%',
      ...theme.rowAlignedCenterVertical
    }
  };
}
