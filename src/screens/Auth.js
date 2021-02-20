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
          <Icon size={theme.scale(55)} name={'lock'} color={theme.textPrimary} />
        </View>
        <Text style={styles.appName}>SecureApp</Text>
        {isLogin ? <Login /> : <SignUp onSignedUp={() => setIsLogin(true)}/>}
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
      paddingHorizontal: theme.scale(60)
    },
    appName: [
      theme.textStyle({
        size: 35,
        font: 'NunitoMedium',
        color: 'textAccent'
      }),
      {
        marginBottom: theme.scale(50)
      }
    ],
    buttonText: [
      theme.textStyle({
        size: 18,
        font: 'NunitoMedium',
        color: 'textSecondary',
        align: 'center'
      }),
      {
        marginTop: theme.scale(30),
      }
    ],
  };
}
