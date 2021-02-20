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
    borderNone = true,
      placeholderColor,
    ...other
  } = props;
  const theme = getTheme();
  const styles = getStyles(theme, borderNone, placeholderColor);
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
          placeholderTextColor={placeholderColor || theme.grey}
        />
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity onPress={onRightIconPress}>
            <Icon
              name={iconName}
              size={theme.scale(18)}
              color={theme.grey}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

function getStyles(theme, border, color) {
  return {
    inputView: [
      {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      },
      border && {
        borderWidth: theme.scale(3),
        borderColor: theme.textPrimary,
        borderStyle: 'solid',
        borderRadius: theme.scale(5),
        paddingHorizontal: theme.scale(10),
      }
    ],
    input: [
      theme.textStyle({
        size: 14,
        align: 'left',
        font: 'NunitoMedium',
        color: color || 'grey',
      }),
      {
        flex: 1,
      }
    ],
    label: [
      theme.textStyle({
        size: 14,
        align: 'left',
        font: 'NunitoMedium',
        color: 'textPlaceholder',
      }),
      {
        marginBottom: theme.scale(10)
      }
    ],
    maxLength: theme.textStyle({
      size: 14,
      align: 'left',
      font: 'NunitoMedium',
      color: 'textPlaceholder',
    })
  };
}
