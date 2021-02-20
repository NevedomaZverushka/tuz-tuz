import React from 'react';
import getTheme from '../global/Style';
import { TouchableOpacity } from "react-native";
import Icon from './Icon';

export default function NewItem(props) {
  const { onPress } = props;
  const theme = getTheme();
  const styles = getStyles(theme);
  return(
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name={'plus'} color={theme.textPrimary} size={theme.scale(40)} />
    </TouchableOpacity>
  );
};

function getStyles(theme) {
  return {
    container: {
      alignItems: 'center',
      backgroundColor: theme.white,
      borderWidth: theme.scale(3),
      borderStyle: 'solid',
      borderColor: theme.white,
      borderRadius: theme.scale(28),
      bottom: theme.scale(20),
      height: theme.scale(56),
      justifyContent: 'center',
      position: 'absolute',
      right: theme.scale(20),
      width: theme.scale(56),
      zIndex: 99,
    },
  };
}
