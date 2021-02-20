import React from 'react';
import getTheme from '../global/Style';
import { Text, View, TouchableWithoutFeedback, Keyboard, ScrollView, BackHandler, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Header, Button, Input, Icon } from '../components';
import {useDispatch, useSelector} from 'react-redux';
import API from '../global/API';
import {setAction} from '../store';
import SecureStorage from 'react-native-secure-storage';

export default function CreateNote(props) {
  const { route } = props;
  const edit = route.params ? route.params.edit : false;
  const theme = getTheme();
  const styles = getStyles(theme);
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const noteData = useSelector(state => state.note);
  const [title, setTitle] = React.useState('');
  const [note, setNote] = React.useState('');
  const onCleanState = React.useCallback(() => {
    setTitle('');
    setNote('');
  }, []);
  const onCancel = React.useCallback(() => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      {
        text: "YES",
        onPress: () => {
          navigate('Home');
          onCleanState();
        }
      }
    ]);
  }, []);
  const onCreate = React.useCallback((user_id, keys, token) => {
    // API.createNote(encryptData(title + '/n' + note, { user_id, token }, keys))
    //   .then((res) => {
    //     if (res.status === 200) {
    //       dispatch(
    //         setAction(
    //           'toast',
    //           { type: "success", text: "Note successfully added!" }
    //         )
    //       );
    //       navigate('Home');
    //       onCleanState();
    //     }
    //     else {
    //       dispatch(
    //         setAction('toast', { type: "error", text: res.error })
    //       );
    //     }
    //   });
  }, [title, note]);
  const onEdit = React.useCallback((user_id, keys, token) => {
    // API.editNote()
    //   .then((res) => {
    //     if (res.status === 200) {
    //       dispatch(
    //         setAction(
    //           'toast',
    //           { type: "success", text: "Note successfully saved!" }
    //         )
    //       );
    //       navigate('Home');
    //       onCleanState();
    //     }
    //     else {
    //       dispatch(
    //         setAction('toast', { type: "error", text: res.error })
    //       );
    //     }
    //   });
  }, [title, note, noteData]);
  const onSubmit = React.useCallback(() => {
    SecureStorage.getItem('signaturePublicKey')
      .then((signaturePublicKey) => {
        SecureStorage.getItem('signaturePrivateKey')
          .then((signaturePrivateKey) => {
            let keys = {};
            if (signaturePublicKey && signaturePrivateKey) {
              keys.public = signaturePublicKey;
              keys.private = signaturePrivateKey;
            }
            else {
              keys = null;

              SecureStorage.setItem('signaturePublicKey', keys.public)
                .then(() => {
                  SecureStorage.setItem('signaturePrivateKey', keys.private);
                });
            }

            SecureStorage.getItem('userId')
              .then((user_id) => {
                SecureStorage.getItem('token')
                    .then((token) => {
                      SecureStorage.getItem('aesKey')
                          .then((aesKey) => {
                            if (edit) onEdit(user_id, {...keys, aesKey}, token);
                            else onCreate(user_id, {...keys, aesKey}, token);
                          });
                    });
              });
          });
      })
  }, [edit]);
  React.useEffect(() => {
    if (noteData.id !== null) {
      setTitle(noteData.title);
      setNote(noteData.note);
    }
  }, [noteData]);
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onCancel();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);
  return(
    <>
      <Header rightIcon={'close'} onClickRightIcon={onCancel} />
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.content}>
            <Text style={styles.title}>{`Note ${edit ? 'editing' : 'creating'}`}</Text>
            <TouchableWithoutFeedback
              style={{flex: 1}}
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View>
                <Input
                  label={'Write your title'}
                  placeholder={'Title'}
                  value={title}
                  onChange={setTitle}
                  containerStyle={{ marginVertical: theme.scale(15) }}
                  maxLength={50}
                />
                <Input
                  label={'Write your note'}
                  placeholder={'Note'}
                  value={note}
                  onChange={setNote}
                  multiline={true}
                  numberOfLines={10}
                  containerStyle={{ marginVertical: theme.scale(15) }}
                  maxLength={200}
                />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={[theme.rowAlignedBetween, { marginVertical: theme.scale(15) }]}
            >
              <Text style={styles.subtitle}>
                Attach file
              </Text>
              <Icon name={"paperclip"} size={theme.scale(27)} color={theme.white} />
            </View>
          </View>
        </ScrollView>
        <Button
          text={'Create note'}
          containerStyle={styles.button}
          onPress={onSubmit}
          buttonColor={theme.textAccent}
          textColor={theme.textPrimary}
        />
      </View>
    </>
  );
}

function getStyles(theme) {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.textPrimary,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.scale(40),
    },
    title: [
      theme.textStyle({
        size: 30,
        font: 'NunitoBold',
        color: 'white',
        align: 'left'
      }),
      {
        marginVertical: theme.scale(20)
      }
    ],
    subtitle: theme.textStyle({
      size: 24,
      align: 'left',
      font: 'NunitoBold',
      color: 'textPlaceholder',
    }),
    button: {
      marginHorizontal: theme.scale(40),
      marginVertical: theme.scale(20),
    }
  };
}
