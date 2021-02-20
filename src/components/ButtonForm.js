import React from 'react';
import { TouchableOpacity, Text } from "react-native";
import getTheme from '../global/Style';

export default function ButtonForm(props) {
  const {
    text = '',
    onPress,
    containerStyle
  } = props;
  const theme = getTheme();
  const styles = getStyles(theme);
  return(
    <TouchableOpacity
      style={[containerStyle, styles.buttonView]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

function getStyles(theme) {
  return {
    buttonView: {
      backgroundColor: theme.textPrimary,
      borderRadius: theme.scale(40),
      paddingHorizontal: theme.scale(55),
      paddingVertical: theme.scale(15)
    },
    buttonText: theme.textStyle({
      size: 18,
      align: 'left',
      font: 'NunitoBold',
      color: 'textPlaceholder',
    }),
  };
}
