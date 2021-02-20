import React from 'react';
import getTheme from '../global/Style';
import { Text, View, ScrollView, RefreshControl } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Header, Button, CardItem, NewItem } from '../components';
import API from '../global/API';
import SecureStorage from 'react-native-secure-storage';
import {useDispatch} from 'react-redux';
import {setAction} from '../store';

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

export default function Home() {
  const theme = getTheme();
  const styles = getStyles(theme);
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = React.useState(true);
  const [cards, setCards] = React.useState([]);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    onGetNotes();
  }, []);

  // const onGetNotes = React.useCallback(() => {
  //   SecureStorage.getItem('userId')
  //     .then((user_id) => {
  //       SecureStorage.getItem('token')
  //         .then((token) => {
  //           API.getAllNotes({ user_id, token })
  //             .then((res) => {
  //               if (res.status === 200) {
  //                 const { notes } = res.data;
  //                 setCards(notes.map((item) => convertData(item)));
  //               }
  //               else {
  //                 dispatch(
  //                   setAction('toast', { type: "error", text: res.error })
  //                 );
  //               }
  //               setRefreshing(false);
  //             });
  //         });
  //     });
  // }, []);

  React.useEffect(() => {
    //if (refreshing) onGetNotes();
  }, [refreshing]);
  return(
    <>
      <Header rightIcon={'user'} onClickRightIcon={() => navigate('Profile')} />
      <View style={styles.container}>
        {/*<ScrollView*/}
        {/*  style={styles.scrollView}*/}
        {/*  bounces={false}*/}
        {/*  showsVerticalScrollIndicator={false}*/}
        {/*  refreshControl={*/}
        {/*    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />*/}
        {/*  }*/}
        {/*>*/}
        {/*  <Button*/}
        {/*    text={'Add new note'}*/}
        {/*    containerStyle={{ marginVertical: theme.scale(20) }}*/}
        {/*    onPress={() => navigate('CreateNote')}*/}
        {/*  />*/}
        {/*  <Text style={styles.title}>All notes</Text>*/}
        {/*  {cards.length === 0*/}
        {/*    ? ( <Text style={styles.subtitle}>No notes have been added yet</Text> )*/}
        {/*    : ( cards.map((card) => <CardItem key={card.id} {...card} />) )*/}
        {/*  }*/}
        {/*</ScrollView>*/}
        {/*<NewItem onPress={() => navigate('CreateNote')} />*/}
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
    scrollView: {
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
    subtitle: [
      theme.textStyle({
        size: 35,
        font: 'NunitoBold',
        color: 'white',
        align: 'center'
      }),
      {
        marginVertical: theme.scale(100)
      }
    ],
  };
}
