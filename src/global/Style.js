import { Dimensions } from 'react-native';

const colors = {
  white: `#f1e8e6`,
  background: `#1c1c1c`,
  textPrimary : `#61CEC0`,
  textSecondary: `#FCE677`,
  textPlaceholder: `#A3DDA8`,
  grey: `#62656c`,
  error: `#bf4a46`,
  warning: `#ffa500`,
  black: '#0d0d0d'
};

const rgba = (hexCode, opacity = 1) => {
  let hex = hexCode.replace('#', '');

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${opacity})`;
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
  rowAlignedBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowAlignedBetweenStretch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
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
    alignItems: 'stretch'
  },
  rowAlignedRightVertical: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  fullScreen: { width, height }
};

export default function getTheme() {
  return {
    fullWidth: width,
    fullHeight: height,
    ...colors,
    ...commonStyles,
    scale,
    textStyle,
    rgba
  };
};
