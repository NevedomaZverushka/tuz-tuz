import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import getTheme from '../global/Style';

export default function Key(props) {
  const { value, onPress } = props;
  const styles = getStyles(getTheme());
  const [pressed, setPressed] = React.useState(false);
  return(
    <TouchableOpacity
      style={[styles.key, pressed && styles.pressedKey]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => onPress(value)}
    >
      <Text style={styles.number}>
        {value}
      </Text>
    </TouchableOpacity>
  )
};

function getStyles(theme) {
  return {
    key: {
      borderWidth: theme.scale(3),
      borderStyle: 'solid',
      borderColor: theme.textAccent,
      borderRadius: theme.scale(50),
      justifyContent: 'center',
      alignItems: 'center',
      width: theme.scale(90),
      height: theme.scale(90),
    },
    pressedKey: {
      backgroundColor: theme.textAccent
    },
    number: theme.textStyle({
      size: 26,
      font: 'NunitoMedium',
      color: 'textSecondary'
    }),
  };
}
