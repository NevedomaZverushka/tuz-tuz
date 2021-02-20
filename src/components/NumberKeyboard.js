import React from 'react';
import getTheme from '../global/Style';
import { View, TouchableOpacity } from 'react-native';
import { Icon, Key } from './index';

export default function NumberKeyboard(props) {
  const { containerStyle, value, onSetValue } = props;
  const theme = getTheme();
  const styles = getStyles(theme);
  const onPress = React.useCallback((number) => {
    if (value.length < 4) onSetValue(prev => prev + number);
  }, [value]);
  const onDelete = React.useCallback(() => {
    if (value.length >= 0) onSetValue(prev => prev.slice(0, -1));
  }, [value]);
  return(
    <View style={[styles.container, containerStyle]}>
      <View style={styles.dotRow}>
        <View style={[ styles.emptyDot, value.length >= 1 && styles.dot ]} />
        <View style={[ styles.emptyDot, value.length >= 2 && styles.dot ]} />
        <View style={[ styles.emptyDot, value.length >= 3 && styles.dot ]} />
        <View style={[ styles.emptyDot, value.length >= 4 && styles.dot ]} />
      </View>
      <View style={styles.keyRow}>
        <Key value={'1'} onPress={onPress} />
        <Key value={'2'} onPress={onPress} />
        <Key value={'3'} onPress={onPress} />
      </View>
      <View style={styles.keyRow}>
        <Key value={'4'} onPress={onPress} />
        <Key value={'5'} onPress={onPress} />
        <Key value={'6'} onPress={onPress} />
      </View>
      <View style={styles.keyRow}>
        <Key value={'7'} onPress={onPress} />
        <Key value={'8'} onPress={onPress} />
        <Key value={'9'} onPress={onPress} />
      </View>
      <View style={styles.keyRow}>
        <View style={styles.secondaryKey} />
        <Key value={'0'} onPress={onPress} />
        <TouchableOpacity style={styles.secondaryKey} onPress={onDelete}>
          {value.length > 0 && (
            <Icon
              size={theme.scale(35)}
              color={theme.textSecondary}
              name={"delete"}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
};

function getStyles(theme) {
  return {
    container: {
      ...theme.rowAlignedVertical,
      marginHorizontal: theme.scale(30)
    },
    dotRow: {
      ...theme.rowAlignedBetween,
      marginBottom: theme.scale(40),
      marginHorizontal: theme.scale(60)
    },
    dot: {
      backgroundColor: theme.textSecondary,
    },
    emptyDot: {
      width: theme.scale(15),
      height: theme.scale(15),
      borderRadius: theme.scale(50),
      borderStyle: 'solid',
      borderWidth: theme.scale(3),
      borderColor: theme.textSecondary
    },
    keyRow: {
      ...theme.rowAlignedBetween,
      marginBottom: theme.scale(25)
    },
    secondaryKey: {
      justifyContent: 'center',
      alignItems: 'center',
      width: theme.scale(90),
      height: theme.scale(90),
    },
  };
}
