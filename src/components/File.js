import React from 'react';
import getTheme from '../global/Style';
import {Text, View} from 'react-native';
import Icon from './Icon';

export default function File(props) {
  const { containerStyle } = props;
  const theme = getTheme();
  const styles = getStyles(theme);
  const [upload, setUpload] = React.useState(false);
  return(
    <View style={[theme.rowAlignedBetween, containerStyle]}>
      <View style={theme.rowAligned}>
        <Icon
          size={theme.scale(23)}
          name={'file'}
          color={theme.textAccent}
          style={styles.fileIcon}
        />
        <Text style={styles.fileName}>
          filename.txt
        </Text>
      </View>
      {upload
        ? (
          <Icon
            size={theme.scale(23)}
            name={'download'}
            color={theme.white}
          />
        ) : (
          <Icon
            size={theme.scale(23)}
            name={'file-download-done'}
            color={theme.textAccent}
          />
        )
      }
    </View>
  );
};

function getStyles(theme) {
  return {
    fileIcon: {
      backgroundColor: theme.textSecondary,
      borderRadius: theme.scale(28),
      justifyContent: 'center',
      alignItems: 'center',
      width: theme.scale(50),
      height: theme.scale(50),
    },
    fileName: [
      theme.textStyle({
        size: 20,
        font: 'NunitoBold',
        color: 'textPlaceholder',
        align: 'left'
      }),
      {
        marginLeft: theme.scale(15)
      }
    ]
  };
}
