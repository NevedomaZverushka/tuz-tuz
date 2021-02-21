import React from 'react';
import getTheme from '../global/Style';
import {Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { Icon, Login, SignUp } from '../components';

export default function Auth() {
  const theme = getTheme();
  const styles = getStyles(theme);
  const [isLogin, setIsLogin] = React.useState(true);
  return(
    <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={{
          flexDirection: 'column',
          justifyContent: 'center',
          marginBottom: theme.scale(25)
        }}>
          <Icon size={theme.scale(55)} name={'car'} color={theme.textPlaceholder} />
        </View>
        <Text style={styles.appName}>Tuz-Tuz</Text>
        {isLogin ? <Login /> : <SignUp />}
        <TouchableOpacity onPress={() => setIsLogin(prev => !prev)}>
          <Text style={styles.buttonText}>
            {`or ${isLogin ? 'Sign up' : 'Log in'}`}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

function getStyles(theme) {
  return {
    container: {
      flex: 1,
      ...theme.rowAlignedCenterVertical,
      backgroundColor: theme.white,
      paddingHorizontal: theme.scale(40)
    },
    appName: [
      theme.textStyle({
        size: 35,
        font: 'NunitoMedium',
        color: 'background'
      }),
      {
        marginBottom: theme.scale(50)
      }
    ],
    buttonText: [
      theme.textStyle({
        size: 18,
        font: 'NunitoMedium',
        color: 'background',
        align: 'center'
      }),
      {
        marginTop: theme.scale(30),
      }
    ],
  };
}
