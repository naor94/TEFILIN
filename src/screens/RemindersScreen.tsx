import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AlarmClock,
  BellRing,
  CheckCircle2,
  Clock,
  Edit3,
  Hourglass,
  Info,
  Music,
  PlusCircle,
  ShieldCheck,
  Sunrise,
  Volume2,
} from 'lucide-react-native';
import { Colors, Shadows } from '../theme/colors';
import { StorageService } from '../services/storageService';
import { ReminderSettings } from '../types';

export const RemindersScreen: React.FC = () => {
  const [settings, setSettings] = useState<ReminderSettings>({
    morningEnabled: true,
    morningTime: '07:30',
    activeDays: [0, 1, 2, 3, 4, 5],
    zmanimAlertEnabled: true,
    zmanimOffsetMinutes: 30,
    sunsetSafetyEnabled: true,
    sunsetOffsetMinutes: 60,
    sound: 'ניגון עדין / שופר',
    snoozeMinutes: 15,
  });

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await StorageService.getReminderSettings();
    setSettings(data);
  };

  const handleDayToggle = (dayIndex: number) => {
    if (dayIndex === 6) {
      Alert.alert(
        'שבת קודש',
        'על פי ההלכה, בשבתות ובימים טובים אין מניחין תפילין, ולכן לא ניתן להפעיל תזכורות בימים אלו.'
      );
      return;
    }

    const currentDays = [...settings.activeDays];
    const exists = currentDays.includes(dayIndex);
    const updatedDays = exists
      ? currentDays.filter((d) => d !== dayIndex)
      : [...currentDays, dayIndex];

    setSettings({ ...settings, activeDays: updatedDays });
  };

  const handleSave = async () => {
    await StorageService.saveReminderSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const days = [
    { index: 0, label: 'א' },
    { index: 1, label: 'ב' },
    { index: 2, label: 'ג' },
    { index: 3, label: 'ד' },
    { index: 4, label: 'ה' },
    { index: 5, label: 'ו' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* PAGE HEADER */}
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <BellRing size={13} color={Colors.onSecondaryContainer} />
          <Text style={styles.headerBadgeText}>סנכרון מדויק לפי הלכה</Text>
        </View>
        <Text style={styles.title}>תזכורות והתראות</Text>
        <Text style={styles.subtitle}>הגדרת זמנים שלא מפספסים אף יום</Text>
      </View>

      {/* CARD 1: PRIMARY MORNING REMINDER */}
      <View style={styles.card}>
        <View style={styles.goldTopAccent} />
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleGroup}>
            <View style={styles.cardTitleRow}>
              <AlarmClock size={19} color={Colors.primary} />
              <Text style={styles.cardTitle}>תזכורת בוקר ראשית</Text>
            </View>
            <Text style={styles.cardDesc}>
              שעת היעד הקבועה שלך להנחת תפילין בנחת
            </Text>
          </View>
          <Switch
            value={settings.morningEnabled}
            onValueChange={(val) =>
              setSettings({ ...settings, morningEnabled: val })
            }
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Time Display Picker Box */}
        <View style={styles.timePickerBox}>
          <View style={styles.timePickerLeft}>
            <Clock size={17} color={Colors.primary} />
            <Text style={styles.timePickerLabel}>זמן התראה מתוזמן</Text>
          </View>
          <TouchableOpacity
            style={styles.timeDisplayBadge}
            onPress={() => {
              Alert.prompt
                ? Alert.prompt(
                    'שינוי שעת בוקר',
                    'הזן שעה בפורמט שעות:דקות (לדוגמה 07:15):',
                    (text) => {
                      if (text) setSettings({ ...settings, morningTime: text });
                    },
                    'plain-text',
                    settings.morningTime
                  )
                : Alert.alert('שעת בוקר', `השעה הנוכחית היא ${settings.morningTime}`);
            }}
          >
            <Text style={styles.timeText}>{settings.morningTime}</Text>
            <Edit3 size={14} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        {/* Repetition Days Grid */}
        <View style={styles.daysSection}>
          <View style={styles.daysHeader}>
            <Text style={styles.daysTitle}>ימי חזרה שבועיים:</Text>
            <View style={styles.daysActiveIndicator}>
              <CheckCircle2 size={13} color={Colors.secondary} />
              <Text style={styles.daysActiveText}>
                {settings.activeDays.length} ימי חול
              </Text>
            </View>
          </View>

          <View style={styles.daysGrid}>
            {days.map((day) => {
              const isActive = settings.activeDays.includes(day.index);
              return (
                <TouchableOpacity
                  key={day.index}
                  style={[styles.dayButton, isActive && styles.dayButtonActive]}
                  onPress={() => handleDayToggle(day.index)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      isActive && styles.dayButtonTextActive,
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* שבת Disabled */}
            <TouchableOpacity
              style={styles.shabbatButton}
              onPress={() => handleDayToggle(6)}
              activeOpacity={0.8}
            >
              <Text style={styles.shabbatButtonText}>ש</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.shabbatNote}>
            <Info size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.shabbatNoteText}>
              שבת קודש: אין תפילין בשבת ומועדים (מושתק אוטומטית)
            </Text>
          </View>
        </View>
      </View>

      {/* CARD 2: DYNAMIC HALACHIC ALERT (Zmanim-linked) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleGroup}>
            <View style={styles.cardTitleRow}>
              <Sunrise size={19} color={Colors.secondary} />
              <Text style={styles.cardTitle}>תזכורת חכמה לפי זמני היום</Text>
            </View>
            <Text style={styles.cardDesc}>
              התראה דינמית המתכווננת לפי עונות השנה וזמן סוף תפילה
            </Text>
          </View>
          <Switch
            value={settings.zmanimAlertEnabled}
            onValueChange={(val) =>
              setSettings({ ...settings, zmanimAlertEnabled: val })
            }
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.subCardBox}>
          <View style={styles.subCardIconGold}>
            <Hourglass size={16} color={Colors.onSecondaryContainer} />
          </View>
          <View style={styles.subCardContent}>
            <Text style={styles.subCardTitle}>
              30 דקות לפני סוף זמן תפילה
            </Text>
            <Text style={styles.subCardSubtitle}>
              היום: שעה 08:15 (לפי הגר״א)
            </Text>
          </View>
        </View>
      </View>

      {/* CARD 3: SUNSET SAFETY NET (Last call before sunset) */}
      <View style={[styles.card, styles.cardSafetyHighlight]}>
        <View style={styles.safetyHeader}>
          <View style={styles.recommendedBadge}>
            <ShieldCheck size={13} color={Colors.onSecondaryContainer} />
            <Text style={styles.recommendedBadgeText}>מומלץ ביותר</Text>
          </View>
          <Switch
            value={settings.sunsetSafetyEnabled}
            onValueChange={(val) =>
              setSettings({ ...settings, sunsetSafetyEnabled: val })
            }
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.cardTitleGroup}>
          <View style={styles.cardTitleRow}>
            <Clock size={19} color={Colors.error} />
            <Text style={[styles.cardTitle, { color: Colors.primary }]}>
              התראת רגע אחרון (שקיעה)
            </Text>
          </View>
          <Text style={styles.cardDesc}>
            שעה לפני שקיעת החמה — התראה שתצלצל{' '}
            <Text style={{ fontWeight: '700', color: Colors.primary }}>
              רק אם טרם סומן
            </Text>{' '}
            באפליקציה שהנחת היום תפילין.
          </Text>
        </View>

        <View style={styles.safetyFootnote}>
          <ShieldCheck size={16} color={Colors.secondary} />
          <Text style={styles.safetyFootnoteText}>
            שומר הלכתי: מונע אי-הנחת תפילין בימים עמוסים
          </Text>
        </View>
      </View>

      {/* CARD 4: SOUND & SNOOZE */}
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { marginBottom: 12 }]}>
          צלילים ונוחות
        </Text>

        {/* Sound Selection */}
        <View style={styles.subCardBox}>
          <View style={styles.subCardIconBlue}>
            <Music size={16} color={Colors.primary} />
          </View>
          <View style={styles.subCardContent}>
            <Text style={styles.subCardSubtitle}>צליל תזכורת נבחר</Text>
            <Text style={styles.subCardTitle}>{settings.sound}</Text>
          </View>
          <Volume2 size={18} color={Colors.onSurfaceVariant} />
        </View>

        {/* Snooze */}
        <View style={[styles.subCardBox, { marginTop: 8 }]}>
          <View style={styles.subCardIconBlue}>
            <Clock size={16} color={Colors.primary} />
          </View>
          <View style={styles.subCardContent}>
            <Text style={styles.subCardSubtitle}>נודניק חכם (Snooze)</Text>
            <Text style={styles.subCardTitle}>
              הזכר לי שוב בעוד {settings.snoozeMinutes} דקות
            </Text>
          </View>
        </View>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.88}
          onPress={handleSave}
        >
          <CheckCircle2 size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>
            {savedSuccess ? 'ההגדרות נשמרו בהצלחה! ✓' : 'שמירת הגדרות'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 36,
    maxWidth: 540,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },
  header: {
    alignItems: 'flex-end',
    gap: 4,
  },
  headerBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 223, 152, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(254, 206, 87, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  headerBadgeText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 11,
    color: Colors.onSecondaryContainer,
  },
  title: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 24,
    color: Colors.primary,
    textAlign: 'right',
  },
  subtitle: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    textAlign: 'right',
  },
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.card,
  },
  cardSafetyHighlight: {
    borderWidth: 1.5,
    borderColor: 'rgba(254, 206, 87, 0.8)',
    ...Shadows.goldGlow,
  },
  goldTopAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.secondary,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardTitleGroup: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  cardTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'right',
  },
  cardDesc: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'right',
    marginTop: 2,
    lineHeight: 18,
  },
  timePickerBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timePickerLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  timePickerLabel: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  timeDisplayBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeText: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 18,
    color: Colors.primary,
  },
  daysSection: {
    marginTop: 14,
    gap: 8,
  },
  daysHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  daysTitle: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  daysActiveIndicator: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  daysActiveText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 11,
    color: Colors.secondary,
  },
  daysGrid: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayButtonText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 15,
    color: Colors.onSurfaceVariant,
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
  },
  shabbatButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  shabbatButtonText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 14,
    color: Colors.outline,
  },
  shabbatNote: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  shabbatNoteText: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 11,
    color: Colors.outline,
    textAlign: 'right',
  },
  subCardBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surfaceContainerLow,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subCardIconGold: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 223, 152, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subCardIconBlue: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subCardContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  subCardTitle: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 13,
    color: Colors.primary,
    textAlign: 'right',
  },
  subCardSubtitle: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    textAlign: 'right',
  },
  safetyHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recommendedBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(254, 206, 87, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  recommendedBadgeText: {
    fontFamily: 'NotoSans_700Bold',
    fontSize: 11,
    color: Colors.onSecondaryContainer,
  },
  safetyFootnote: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceContainer,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  safetyFootnoteText: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    flex: 1,
    textAlign: 'right',
  },
  actionButtons: {
    marginTop: 8,
    gap: 10,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    ...Shadows.card,
  },
  saveButtonText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
