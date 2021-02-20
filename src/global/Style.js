import { Dimensions } from 'react-native';

const colors = {
  white: `#e5ecf4`,
  textPrimary: `#303644`,
  textSecondary: `#62656c`,
  textPlaceholder: `#c1c6cc`,
  textAccent: `#47cb78`,
  error: `#cb6347`,
  warning: `#ffa500`,
};

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const scale = (value) => {
  if (height / width >= 2) return (value * width) / 375;
  else return (value * height) / 812;
};

const textSizes = {
  [9]: {
    fontSize: scale(9),
    letterSpacing: scale(0.5),
    lineHeight: scale(14),
  },
  [10]: {
    fontSize: scale(10),
    letterSpacing: scale(0.5),
    lineHeight: scale(14),
  },
  [12]: {
    fontSize: scale(12),
    letterSpacing: scale(0.5),
    lineHeight: scale(18),
  },
  [14]: {
    fontSize: scale(14),
    letterSpacing: scale(0.5),
    lineHeight: scale(18),
  },
  [16]: {
    fontSize: scale(16),
    letterSpacing: scale(0.5),
    lineHeight: scale(20),
  },
  [18]: {
    fontSize: scale(18),
    letterSpacing: scale(0.5),
    lineHeight: scale(24),
  },
  [20]: {
    fontSize: scale(20),
    letterSpacing: scale(0.5),
    lineHeight: scale(24),
  },
  [24]: {
    fontSize: scale(24),
    letterSpacing: scale(0.5),
    lineHeight: scale(32),
  },
  [26]: {
    fontSize: scale(26),
    letterSpacing: scale(0.5),
    lineHeight: scale(32),
  },
  [30]: {
    fontSize: scale(30),
    letterSpacing: 0,
    lineHeight: scale(36),
  },
  [35]: {
    fontSize: scale(35),
    letterSpacing: 0,
    lineHeight: scale(38),
  },
  [40]: {
    fontSize: scale(40),
    letterSpacing: 0,
    lineHeight: scale(40),
  },
};
const fonts = {
  NunitoBold: 'Nunito-Bold',
  NunitoRegular: 'Nunito-Light',
  NunitoMedium: 'Nunito-SemiBold',
};
const textStyle = ({ color, font, size, align = 'center' }) => {
  return {
    color: colors[color],
    fontFamily: fonts[font],
    fontSize: textSizes[size].fontSize,
    letterSpacing: textSizes[size].letterSpacing,
    lineHeight: textSizes[size].lineHeight,
    textAlign: align
  };
};

const commonStyles = {
  rowAligned: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowAlignedBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowAlignedVertical: {
    flexDirection: 'column',
  },
  rowAlignedCenterVertical: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowAlignedBetweenVertical: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};

export default function getTheme() {
  return {
    ...colors,
    ...commonStyles,
    scale,
    textStyle
  };
};
