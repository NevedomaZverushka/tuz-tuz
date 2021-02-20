import React from 'react';
import getTheme from '../global/Style';
import { useNavigation } from '@react-navigation/native';
import SecureStorage from 'react-native-secure-storage';
import {Text, TouchableOpacity, View} from 'react-native';
import { NumberKeyboard, Spinner } from '../components';
import API from '../global/API';
import {useDispatch} from 'react-redux';
import {setAction} from '../store';

const useVerificationCodeGenerator = () => {
  return (Math.random().toString().slice(-4)).toString();
};

let verificationCode = null;

export default function Verification() {
  const theme = getTheme();
  const styles = getStyles(theme);
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const [loading, setLoading] = React.useState(true);
  const [code, setCode] = React.useState('');
  const [email, setEmail] = React.useState(null);
  const isCodeRight = React.useMemo(() => {
    if (code.length === 4) return code === verificationCode;
    else return null;
  }, [code, verificationCode]);
  const onCodeSend = React.useCallback(() => {
    verificationCode = useVerificationCodeGenerator();
    SecureStorage.getItem('token')
      .then((token) => {
        API.verificateUser({ code: verificationCode, token })
          .then((res) => {
            setEmail(res.data.email);
            if (res.status !== 200) console.log(res.error);
            setLoading(false);
          });
      });
  }, [verificationCode]);
  React.useEffect(() => onCodeSend(), []);
  React.useEffect(() => {
    if (isCodeRight === true) navigate('Home');
    else if (isCodeRight === false) {
      dispatch(
        setAction(
          'toast',
          { text: 'You entered the wrong code, please try again', type: 'error' }
        )
      );
      setCode('');
    }
  }, [isCodeRight]);
  if (loading) return <Spinner />;
  else {
    return(
      <View style={styles.container}>
        <Text style={styles.title}>Finish your registration</Text>
        <Text style={styles.description}>
          {`Please, enter your verification code sent to ${email}`}
        </Text>
        <NumberKeyboard
          containerStyle={{ marginTop: theme.scale(35) }}
          value={code}
          onSetValue={setCode}
        />
        <TouchableOpacity onPress={onCodeSend}>
          <Text style={styles.buttonText}>
            Send code again
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

function getStyles(theme) {
  return {
    container: {
      flex: 1,
      ...theme.rowAlignedVertical,
      backgroundColor: theme.white,
      paddingHorizontal: theme.scale(50),
      paddingVertical: theme.scale(60)
    },
    title: [
      theme.textStyle({
        size: 35,
        font: 'NunitoMedium',
        color: 'textAccent'
      }),
      {
        marginBottom: theme.scale(40)
      }
    ],
    description: theme.textStyle({
      size: 20,
      font: 'NunitoMedium',
      color: 'textPrimary',
      align: 'left'
    }),
    buttonText: theme.textStyle({
      size: 18,
      font: 'NunitoMedium',
      color: 'textPlaceholder',
      align: 'center'
    }),
  };
}
