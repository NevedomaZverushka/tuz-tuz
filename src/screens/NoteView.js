import React from 'react';
import getTheme from '../global/Style';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {Header, File, Icon, Spinner} from '../components';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import API from '../global/API';
import SecureStorage from 'react-native-secure-storage';
import { setAction } from '../store';
import moment from 'moment';

const convertData = (data) => {
  const noteData = null;
  const arrayOfStrings = noteData.data.split("/n");
  return {
    title: arrayOfStrings[0],
    note: arrayOfStrings[1],
    created_at: data.created_at,
    id: data.id,
    status: noteData.status
  }
};

export default function NoteView(props) {
  const { route } = props;
  const { noteId } = route.params;
  const theme = getTheme();
  const styles = getStyles(theme);
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const [note, setNote] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const onEdit = React.useCallback(() => {
    dispatch(setAction('note', note));
    navigate('CreateNote', { edit: true });
  }, [note]);
  const onDelete = React.useCallback(() => {
    SecureStorage.getItem('userId')
      .then((user_id) => {
        API.deleteNote({ user_id, id: note.id })
          .then((res) => {
            if (res.status === 200) navigate('Home');
            else {
              dispatch(
                setAction('toast', { type: "error", text: res.error })
              );
            }
          });
      });
  }, [note]);

  React.useEffect(() => {
    SecureStorage.getItem('userId')
      .then((user_id) => {
        API.getNote({ id: noteId, user_id })
          .then((res) => {
            if (res.status === 200) {
              const { data } = res;
              const { title, note, created_at, id, status } = convertData(data);
              if (!status) {
                dispatch(
                  setAction('toast', { type: "warning", text: "The data may have been corrupted." })
                );
              }
              setNote({ title, note, created_at, id });
              setLoading(false);
            }
            else {
              dispatch(
                setAction('toast', { type: "error", text: res.error })
              );
            }
          });
      });
  }, []);
  if (loading) return <Spinner />;
  else {
    return(
      <View style={styles.container}>
        <Header rightIcon={'close'} onClickRightIcon={() => navigate('Home')} />
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.info}>{moment(note.created_at).fromNow()}</Text>
          <Text style={styles.text}>{note.note}</Text>
          <Text style={[styles.subtitle, { marginBottom: theme.scale(30) }]}>
            Pinned files:
          </Text>
          <File containerStyle={{ marginBottom: theme.scale(10) }} />
          <File containerStyle={{ marginBottom: theme.scale(10) }} />
        </ScrollView>
        <View style={styles.buttonsRow}>
          <TouchableOpacity onPress={onEdit}>
            <Icon
              size={theme.scale(28)}
              name={'edit-2'}
              color={theme.white}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              size={theme.scale(30)}
              name={'export'}
              color={theme.white}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              size={theme.scale(30)}
              name={'copy'}
              color={theme.white}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Icon
              size={theme.scale(30)}
              name={'delete-outline'}
              color={theme.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

function getStyles(theme) {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.textPrimary,
    },
    scrollView: {
      paddingHorizontal: theme.scale(40),
    },
    buttonsRow: {
      ...theme.rowAlignedBetween,
      marginVertical: theme.scale(20),
      paddingHorizontal: theme.scale(100),
    },
    title: [
      theme.textStyle({
        size: 26,
        font: 'NunitoBold',
        color: 'textAccent',
        align: 'left'
      }),
      {
        marginTop: theme.scale(30)
      }
    ],
    info: [
      theme.textStyle({
        size: 16,
        font: 'NunitoBold',
        color: 'textSecondary',
        align: 'left'
      }),
      {
        marginBottom: theme.scale(30),
        marginTop: theme.scale(5)
      }
    ],
    text: [
      theme.textStyle({
        size: 20,
        font: 'NunitoRegular',
        color: 'white',
        align: 'justify'
      }),
      {
        marginBottom: theme.scale(50)
      }
    ],
    subtitle: theme.textStyle({
      size: 20,
      font: 'NunitoBold',
      color: 'textPlaceholder',
      align: 'left'
    }),
  };
}
