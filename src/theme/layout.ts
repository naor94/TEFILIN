import { I18nManager, TextStyle, ViewStyle } from 'react-native';

export const RTL = {
  // סגנון מעטפת RTL מחייב עבור Yoga Layout Engine
  container: {
    direction: 'rtl' as const,
  } as ViewStyle,

  // שורות זורמות מימין לשמאל
  row: 'row' as const,

  // יישור לימין (בתוך direction: 'rtl', ההתחלה היא בימין)
  alignRight: 'flex-start' as const,

  // יישור לשמאל (בתוך direction: 'rtl', הסוף הוא בשמאל)
  alignLeft: 'flex-end' as const,

  // יישור טקסט וכיוון כתיבה עברי
  textRight: {
    textAlign: 'right' as TextStyle['textAlign'],
    writingDirection: 'rtl' as TextStyle['writingDirection'],
  },
  textCenter: {
    textAlign: 'center' as TextStyle['textAlign'],
    writingDirection: 'rtl' as TextStyle['writingDirection'],
  },
};

