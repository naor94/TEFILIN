import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, MapPin } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { RTL } from '../theme/layout';

interface HeaderBarProps {
  locationName?: string;
  onLocationPress?: () => void;
  onCalendarPress?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  locationName = 'ירושלים',
  onLocationPress,
  onCalendarPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {/* ימין: מיקום נוכחי */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onLocationPress}
          style={styles.locationButton}
          accessibilityLabel="שינוי מיקום"
        >
          <MapPin size={18} color={Colors.primary} strokeWidth={2.2} />
          <Text style={styles.locationText}>{locationName}</Text>
        </TouchableOpacity>

        {/* מרכז: שם האפליקציה */}
        <View style={styles.centerTitleContainer}>
          <Text style={styles.title}>אות וזיכרון</Text>
        </View>

        {/* שמאל: כפתור לוח שנה */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onCalendarPress}
          style={styles.iconButton}
          accessibilityLabel="לוח שנה"
        >
          <Calendar size={20} color={Colors.primary} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    zIndex: 40,
  },
  inner: {
    flexDirection: RTL.row,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: 540,
    alignSelf: 'center',
    width: '100%',
  },
  locationButton: {
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerLow,
  },
  locationText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 13,
    color: Colors.onSurface,
    ...RTL.textRight,
  },
  centerTitleContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 20,
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerLow,
  },
});

