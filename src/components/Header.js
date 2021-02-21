import React from 'react';
import { TouchableOpacity, Text, View } from "react-native";
import getTheme from '../global/Style';
import Icon from './Icon';

export default function Header(props) {
  const { rightIcon, leftIcon, onClickRightIcon, onClickLeftIcon, text, subtext } = props;
  const theme = getTheme();
  const styles = getStyles(theme);
  return(
    <View style={styles.header}>
      {leftIcon && (
          <TouchableOpacity onPress={onClickLeftIcon} style={{ flex: 0.1 }}>
            <Icon
                size={theme.scale(28)}
                name={leftIcon}
                color={theme.textPrimary}
            />
          </TouchableOpacity>
      )}
      <View style={[{ flex: 0.8 }, theme.rowAlignedCenterVertical]}>
        {subtext && (
            <Text style={styles.subtitle}>
              {subtext}
            </Text>
        )}
        <Text style={styles.title}>
          {text}
        </Text>
      </View>
      {rightIcon && (
          <TouchableOpacity onPress={onClickRightIcon} style={{ flex: 0.1 }}>
            <Icon
                size={theme.scale(25)}
                name={rightIcon}
                color={theme.white}
                style={styles.icon}
            />
          </TouchableOpacity>
      )}
    </View>
  );
};

function getStyles(theme) {
  return {
    header: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.scale(15),
      paddingVertical: theme.scale(15),
      backgroundColor: theme.white
    },
    title: theme.textStyle({
      size: 18,
      font: 'NunitoBold',
      color: 'textPrimary',
      align: 'center'
    }),
    subtitle: theme.textStyle({
      size: 14,
      font: 'NunitoMedium',
      color: 'background',
      align: 'center'
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
