import { TextStyle, ViewStyle } from 'react-native';

type Colors = {
  background: string;
  primary: string;
  error: string;
  white: string;
};

type Theme = {
  colors: Colors;
  buttons: {
    primary: ViewStyle;
  };
  typography: {
    h1: TextStyle;
    text: TextStyle;
    textSmall: TextStyle;
    label: TextStyle;
    button: TextStyle;
    placeholder: TextStyle;
  };
};

const colors: Colors = {
  background: '#F8F8F8',
  primary: '#0A2463',
  error: '#DC0202',
  white: '#FFFFFF',
};

const buttonStyle: ViewStyle = {
  width: '100%',
  borderRadius: 16,
  padding: 12,
  alignItems: 'center',
  justifyContent: 'center',
};

export const theme: Theme = {
  colors,
  buttons: {
    primary: {
      ...buttonStyle,
      backgroundColor: colors.primary,
    },
  },
  typography: {
    h1: {
      fontSize: 28,
      fontFamily: 'RethinkSans-Bold',
      color: colors.primary,
    },
    text: {
      fontSize: 16,
      fontFamily: 'RethinkSans-Regular',
      color: colors.primary,
    },
    textSmall: {
      fontSize: 12,
      fontFamily: 'RethinkSans-Regular',
      color: colors.primary,
    },
    label: {
      fontSize: 14,
      fontFamily: 'RethinkSans-SemiBold',
      color: colors.primary,
    },
    button: {
      fontSize: 16,
      fontFamily: 'RethinkSans-SemiBold',
      color: colors.white,
    },
    placeholder: {
      fontSize: 16,
      fontFamily: 'RethinkSans-Regular',
      color: colors.primary,
      opacity: 0.6,
    },
  },
};

export type TextVariants = keyof Theme['typography'];
export type ButtonVariants = keyof Theme['buttons'];
export type ColorKeys = keyof Colors;
