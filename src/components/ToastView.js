import React from 'react';
import Toast, { DURATION } from 'react-native-easy-toast';
import {useSelector} from 'react-redux';
import getTheme from '../global/Style';
import {useDispatch} from 'react-redux';
import { cleanAction } from '../store';

const theme = getTheme();

const types = {
  "warning": { color: theme.warning },
  "error": { color: theme.error },
  "success": { color: theme.textAccent }
};

export default function ToastView() {
  const dispatch = useDispatch();
  const toastRef = React.useRef(null);
  const toast = useSelector(state => state.toast);
  React.useEffect(() => {
    if (toast.state) {
      toastRef?.current?.show(toast.text, 5000, () => {
        dispatch(cleanAction('toast'));
      });
    }
  }, [toast, toastRef]);
  return(
    <Toast
      ref={toastRef}
      style={{
        backgroundColor: types[toast.type]?.color || theme.textAccent,
        marginTop: theme.scale(150),
        paddingVertical: theme.scale(15),
        paddingHorizontal: theme.scale(35)
      }}
      position={'bottom'}
      positionValue={200}
      fadeInDuration={750}
      fadeOutDuration={750}
      opacity={0.8}
      textStyle={
        theme.textStyle({
          size: 20,
          font: 'NunitoMedium',
          color: 'white',
          align: 'center'
        })
      }
    />
  )
};
