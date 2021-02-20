import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import getTheme from '../global/Style';
import Icon from './Icon';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

export default function CardItem(props) {
  const { id, created_at, title, note, status } = props;
  const theme = getTheme();
  const styles = getStyles(theme, { status });
  const { navigate } = useNavigation();
  const onPress = React.useCallback(() => {
    navigate('NoteView', { noteId: id });
  }, []);
  return(
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemText} numberOfLines={2}>{note}</Text>
      <View style={theme.rowAlignedBetween}>
        <Text style={styles.itemDate}>{moment(created_at).fromNow()}</Text>
        <View style={theme.rowAligned}>
          <TouchableOpacity>
            <Icon
              name={'edit-2'}
              color={theme.textPlaceholder}
              size={theme.scale(23)}
              style={{ marginRight: theme.scale(5) }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name={'delete-outline'}
              color={theme.textPlaceholder}
              size={theme.scale(27)}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

function getStyles(theme, props) {
  return {
    item: {
      width: '100%',
      overflow: 'hidden',
      padding: theme.scale(15),
      borderWidth: theme.scale(3),
      borderStyle: 'solid',
      borderColor: props.status ? theme.textAccent : theme.error,
      borderRadius: theme.scale(5),
      marginVertical: theme.scale(10),
    },
    itemTitle: theme.textStyle({
      size: 18,
      align: 'left',
      font: 'NunitoMedium',
      color: 'textPlaceholder',
    }),
    itemText: [
      theme.textStyle({
        size: 20,
        align: 'left',
        font: 'NunitoBold',
        color: 'white',
      }),
      {
        marginVertical: theme.scale(20)
      }
    ],
    itemDate: theme.textStyle({
      size: 18,
      align: 'left',
      font: 'NunitoMedium',
      color: 'textSecondary',
    })
  };
}
