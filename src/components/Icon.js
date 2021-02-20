import React from 'react';
import { View } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const iconsAntDesign = ['lock', 'user', 'export', 'paperclip', 'car'];
const iconsMaterialCommunityIcons = [
  'eye-off-outline',
  'eye-outline',
  'email-outline',
  'delete-outline',
  'close'
];
const iconsEntypo = ['plus', 'chevron-left', 'chevron-right'];
const iconsFeather = ['edit-2', 'copy', 'file', 'download', 'delete'];
const iconsMaterialIcons = ['file-download-done', 'arrow-back', 'search', 'close', 'star', 'star-border', 'my-location', 'layers-outline', 'navigation'];
const iconsFontAwesome5 = ['map-marker-alt'];

const selectIcon = (name) => {
  if (iconsAntDesign.includes(name)) return AntDesign;
  if (iconsMaterialCommunityIcons.includes(name)) return MaterialCommunityIcons;
  if (iconsEntypo.includes(name)) return Entypo;
  if (iconsFeather.includes(name)) return Feather;
  if (iconsMaterialIcons.includes(name)) return MaterialIcons;
  if (iconsFontAwesome5.includes(name)) return FontAwesome5;
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
