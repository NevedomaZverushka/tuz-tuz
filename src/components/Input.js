import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import getTheme from '../global/Style';
import Icon from './Icon';

export default function Input(props) {
  const {
    value = '',
    onChange,
    placeholder,
    rightIcon,
    secureTextEntry,
    label = '',
    containerStyle,
    dark = true,
    ...other
  } = props;
  const theme = getTheme();
  const styles = getStyles(theme, dark);
  const [secureText, setSecureText] = React.useState(secureTextEntry || false);
  const rest = React.useMemo(() => {
    return {...other, secureTextEntry: secureText};
  }, [secureText]);
  const iconName = React.useMemo(() => {
    if (rightIcon) return rightIcon;
    if (secureText) return 'eye-off-outline';
    else return 'eye-outline';
  }, [rightIcon, secureText]);
  const onRightIconPress = React.useCallback(() => {
    if (secureTextEntry) setSecureText(prev => !prev);
  }, [secureTextEntry]);
  return(
    <View style={containerStyle}>
      <View style={theme.rowAlignedBetween}>
        {!!label && <Text style={styles.label}>{label}</Text>}
        {rest.maxLength &&
          <Text style={styles.maxLength}>{value.length}/{rest.maxLength}</Text>
        }
      </View>
      <View style={styles.inputView}>
        <TextInput
          {...rest}
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={
            dark ? theme.textSecondary : theme.textPlaceholder
          }
        />
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity onPress={onRightIconPress}>
            <Icon
              name={iconName}
              size={theme.scale(26)}
              color={theme.textAccent}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

function getStyles(theme, mode) {
  return {
    inputView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      borderWidth: theme.scale(3),
      borderColor: mode ? theme.white : theme.textPrimary,
      borderStyle: 'solid',
      borderRadius: theme.scale(5),
      backgroundColor: mode ? theme.textPrimary : theme.white,
      paddingHorizontal: theme.scale(10),
    },
    input: [
      theme.textStyle({
        size: 18,
        align: 'left',
        font: 'NunitoMedium',
        color: mode ? 'white' : 'textPrimary',
      }),
      {
        flex: 1,
        textAlignVertical: 'top',
      }
    ],
    label: [
      theme.textStyle({
        size: 18,
        align: 'left',
        font: 'NunitoMedium',
        color: 'textPlaceholder',
      }),
      {
        marginBottom: theme.scale(10)
      }
    ],
    maxLength: theme.textStyle({
      size: 18,
      align: 'left',
      font: 'NunitoMedium',
      color: 'textPlaceholder',
    })
  };
}
