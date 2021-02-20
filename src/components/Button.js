import React from 'react';
import { TouchableOpacity, Text } from "react-native";
import getTheme from '../global/Style';

export default function Button(props) {
  const theme = getTheme();
  const {
    text = '',
    onPress,
    containerStyle,
    buttonColor = theme.textSecondary,
    textColor = theme.white,
  } = props;
  const styles = getStyles(theme);
  return(
    <TouchableOpacity
      style={
        [
          containerStyle,
          styles.buttonView,
          { backgroundColor: buttonColor }
        ]
      }
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          { color: textColor}
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

function getStyles(theme) {
  return {
    buttonView: {
      backgroundColor: theme.textSecondary,
      borderRadius: theme.scale(5),
      paddingHorizontal: theme.scale(55),
      paddingVertical: theme.scale(15),
    },
    text: [
      theme.textStyle({
        size: 14,
        font: 'NunitoBold',
      }),
      { width: "100%" }
    ]
  };
}
