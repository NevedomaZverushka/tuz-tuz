import React from 'react';
import { TouchableOpacity, Text, View } from "react-native";
import getTheme from '../global/Style';
import Icon from './Icon';

export default function Header(props) {
  const { rightIcon, onClickRightIcon } = props;
  const theme = getTheme();
  const styles = getStyles(theme);
  return(
    <View style={styles.header}>
      <View style={theme.rowAligned}>
        <Icon
          size={theme.scale(39)}
          name={'lock'}
          color={theme.textAccent}
          style={{ marginRight: theme.scale(5) }}
        />
        <Text style={styles.title}>
          SecureApp
        </Text>
      </View>
      <TouchableOpacity onPress={onClickRightIcon}>
        <Icon
          size={theme.scale(25)}
          name={rightIcon}
          color={theme.white}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

function getStyles(theme) {
  return {
    header: {
      ...theme.rowAlignedBetween,
      backgroundColor: theme.textPrimary,
      paddingHorizontal: theme.scale(30),
      paddingVertical: theme.scale(15)
    },
    title: theme.textStyle({
      size: 18,
      font: 'NunitoBold',
      color: 'white',
      align: 'left'
    }),
    icon: {
      backgroundColor: theme.textPrimary,
      borderWidth: theme.scale(3),
      borderStyle: 'solid',
      borderColor: theme.white,
      borderRadius: theme.scale(28),
      justifyContent: 'center',
      alignItems: 'center',
      width: theme.scale(39),
      height: theme.scale(39),
    }
  };
}
