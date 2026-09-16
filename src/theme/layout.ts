import { I18nManager, TextStyle, ViewStyle } from 'react-native';

export const isRTL = I18nManager.isRTL;

export const RTL = {
  // שורה הזורמת תמיד מימין לשמאל, ללא תלות בשפת מערכת ההפעלה
  row: (isRTL ? 'row' : 'row-reverse') as 'row' | 'row-reverse',
  
  // יישור לצד ימין (ההתחלה בעברית)
  alignRight: (isRTL ? 'flex-start' : 'flex-end') as 'flex-start' | 'flex-end',
  
  // יישור לצד שמאל
  alignLeft: (isRTL ? 'flex-end' : 'flex-start') as 'flex-start' | 'flex-end',
  
  // יישור טקסט וכיוון כתיבה
  textRight: {
    textAlign: 'right' as TextStyle['textAlign'],
    writingDirection: 'rtl' as TextStyle['writingDirection'],
  },
  textCenter: {
    textAlign: 'center' as TextStyle['textAlign'],
    writingDirection: 'rtl' as TextStyle['writingDirection'],
  },
};
