import React from 'react';
import { View } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const iconsAntDesign = ['lock', 'user', 'export', 'paperclip'];
const iconsMaterialCommunityIcons = [
  'eye-off-outline',
  'eye-outline',
  'email-outline',
  'delete-outline',
  'close'
];
const iconsEntypo = ['plus', 'chevron-left', 'chevron-right'];
const iconsFeather = ['edit-2', 'copy', 'file', 'download', 'delete'];
const iconsMaterialIcons = ['file-download-done'];

const selectIcon = (name) => {
  if (iconsAntDesign.includes(name)) return AntDesign;
  if (iconsMaterialCommunityIcons.includes(name)) return MaterialCommunityIcons;
  if (iconsEntypo.includes(name)) return Entypo;
  if (iconsFeather.includes(name)) return Feather;
  if (iconsMaterialIcons.includes(name)) return MaterialIcons;
};

export default function Icon(props) {
  const { name, color, size, style } = props;
  const Icon = selectIcon(name);
  return(
    <View style={style}>
      <Icon name={name} color={color} size={size} />
    </View>
  );
}
