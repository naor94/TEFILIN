import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
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
  Minus,
  Music,
  Plus,
  PlusCircle,
  ShieldCheck,
  Sunrise,
  Volume2,
  X,
} from 'lucide-react-native';
import { Colors, Shadows } from '../theme/colors';
import { RTL } from '../theme/layout';
import { StorageService } from '../services/storageService';
import { NotificationService } from '../services/notificationService';
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
  const [isTimePickerVisible, setIsTimePickerVisible] = useState<boolean>(false);
  const [pickerHours, setPickerHours] = useState<number>(7);
  const [pickerMinutes, setPickerMinutes] = useState<number>(30);

  useEffect(() => {
    loadSettings();
    NotificationService.init();
  }, []);

  const loadSettings = async () => {
    const data = await StorageService.getReminderSettings();
    setSettings(data);
  };

  const openTimePicker = () => {
    const parts = settings.morningTime.split(':');
    if (parts.length === 2) {
      setPickerHours(parseInt(parts[0], 10) || 7);
      setPickerMinutes(parseInt(parts[1], 10) || 30);
    }
    setIsTimePickerVisible(true);
  };

  const savePickedTime = async () => {
    const h = pickerHours.toString().padStart(2, '0');
    const m = pickerMinutes.toString().padStart(2, '0');
    const newTime = `${h}:${m}`;
    const updated = { ...settings, morningTime: newTime };
    setSettings(updated);
    setIsTimePickerVisible(false);
    await StorageService.saveReminderSettings(updated);
    await NotificationService.scheduleReminders(updated);
  };

  const adjustHours = (delta: number) => {
    setPickerHours((prev) => {
      let next = (prev + delta) % 24;
      if (next < 0) next = 23;
      return next;
    });
  };

  const adjustMinutes = (delta: number) => {
    setPickerMinutes((prev) => {
      let next = (prev + delta) % 60;
      if (next < 0) next = 55;
      return next;
    });
  };

  const setPresetTime = (h: number, m: number) => {
    setPickerHours(h);
    setPickerMinutes(m);
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

  const handleSoundToggle = () => {
    const SOUND_OPTIONS = ['ניגון עדין / שופר', 'פעמון בית כנסת', 'ניגון חסידי שקט', 'רטט בלבד'];
    const currentIndex = SOUND_OPTIONS.indexOf(settings.sound);
    const next = SOUND_OPTIONS[(currentIndex + 1) % SOUND_OPTIONS.length];
    setSettings((prev) => {
      const updated = { ...prev, sound: next };
      StorageService.saveReminderSettings(updated);
      return updated;
    });
  };

  const handleSnoozeToggle = () => {
    const SNOOZE_OPTIONS = [5, 10, 15, 20, 30];
    const currentIndex = SNOOZE_OPTIONS.indexOf(settings.snoozeMinutes);
    const next = SNOOZE_OPTIONS[(currentIndex + 1) % SNOOZE_OPTIONS.length];
    setSettings((prev) => {
      const updated = { ...prev, snoozeMinutes: next };
      StorageService.saveReminderSettings(updated);
      return updated;
    });
  };

  const handleZmanimOffsetToggle = () => {
    const ZMANIM_OFFSETS = [15, 30, 45, 60];
    const currentIndex = ZMANIM_OFFSETS.indexOf(settings.zmanimOffsetMinutes);
    const next = ZMANIM_OFFSETS[(currentIndex + 1) % ZMANIM_OFFSETS.length];
    setSettings((prev) => {
      const updated = { ...prev, zmanimOffsetMinutes: next };
      StorageService.saveReminderSettings(updated);
      return updated;
    });
  };

  const handleSave = async () => {
    await StorageService.saveReminderSettings(settings);
    const scheduled = await NotificationService.scheduleReminders(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    if (!scheduled && settings.morningEnabled) {
      Alert.alert(
        'הרשאת התראות נדרשת',
        'על מנת שתוכל לקבל את התזכורת בזמן ולשמוע את הצליל, יש לאשר הרשאות התראה בהגדרות הטלפון.'
      );
    }
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
        <TouchableOpacity
          style={styles.timePickerBox}
          onPress={openTimePicker}
          activeOpacity={0.7}
        >
          <View style={styles.timePickerLeft}>
            <Clock size={17} color={Colors.primary} />
            <Text style={styles.timePickerLabel}>זמן התראה מתוזמן (לחץ לעריכה)</Text>
          </View>
          <View style={styles.timeDisplayBadge}>
            <Text style={styles.timeText}>{settings.morningTime}</Text>
            <Edit3 size={14} color={Colors.onSurfaceVariant} />
          </View>
        </TouchableOpacity>

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

        <TouchableOpacity
          style={styles.subCardBox}
          onPress={handleZmanimOffsetToggle}
          activeOpacity={0.7}
        >
          <View style={styles.subCardIconGold}>
            <Hourglass size={16} color={Colors.onSecondaryContainer} />
          </View>
          <View style={styles.subCardContent}>
            <Text style={styles.subCardTitle}>
              {settings.zmanimOffsetMinutes} דקות לפני סוף זמן תפילה (לחץ לשינוי)
            </Text>
            <Text style={styles.subCardSubtitle}>
              היום: שעה 08:15 (לפי הגר״א)
            </Text>
          </View>
          <Edit3 size={14} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
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
        <TouchableOpacity
          style={styles.subCardBox}
          onPress={handleSoundToggle}
          activeOpacity={0.7}
        >
          <View style={styles.subCardIconBlue}>
            <Music size={16} color={Colors.primary} />
          </View>
          <View style={styles.subCardContent}>
            <Text style={styles.subCardSubtitle}>צליל תזכורת נבחר (לחץ להחלפה)</Text>
            <Text style={styles.subCardTitle}>{settings.sound}</Text>
          </View>
          <Volume2 size={18} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>

        {/* Snooze */}
        <TouchableOpacity
          style={[styles.subCardBox, { marginTop: 8 }]}
          onPress={handleSnoozeToggle}
          activeOpacity={0.7}
        >
          <View style={styles.subCardIconBlue}>
            <Clock size={16} color={Colors.primary} />
          </View>
          <View style={styles.subCardContent}>
            <Text style={styles.subCardSubtitle}>נודניק חכם (לחץ לשינוי)</Text>
            <Text style={styles.subCardTitle}>
              הזכר לי שוב בעוד {settings.snoozeMinutes} דקות
            </Text>
          </View>
          <Edit3 size={14} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
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

        {/* Instant Sound Test Button */}
        <TouchableOpacity
          style={styles.testButton}
          activeOpacity={0.8}
          onPress={async () => {
            const ok = await NotificationService.triggerTestNotification();
            if (ok) {
              Alert.alert(
                'בדיקת צליל והתראה נשלחה! 🔔',
                'ההתראה תופיע בעוד 2 שניות במכשיר עם צליל ורטט.\n\nשים לב: ודא שהטלפון אינו במצב "שקט" או "נא לא להפריע".'
              );
            } else {
              Alert.alert(
                'הרשאת התראות נדרשת',
                'יש לאשר הרשאות התראה בהגדרות הטלפון כדי לשמוע את הצליל.'
              );
            }
          }}
        >
          <Volume2 size={18} color={Colors.primary} />
          <Text style={styles.testButtonText}>
            בדיקת צליל והתראה במכשיר (השמעה עכשיו)
          </Text>
        </TouchableOpacity>
      </View>

      {/* TIME PICKER MODAL */}
      <Modal
        visible={isTimePickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsTimePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>בחירת שעת תזכורת בוקר</Text>
              <TouchableOpacity
                onPress={() => setIsTimePickerVisible(false)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* Time Adjuster Wheels */}
            <View style={styles.pickerWheelsRow}>
              {/* Hours Column */}
              <View style={styles.pickerColumn}>
                <Text style={styles.columnLabel}>שעה</Text>
                <TouchableOpacity
                  onPress={() => adjustHours(1)}
                  style={styles.adjustBtn}
                  activeOpacity={0.7}
                >
                  <Plus size={20} color={Colors.primary} />
                </TouchableOpacity>
                <View style={styles.timeDigitBox}>
                  <Text style={styles.timeDigitText}>
                    {pickerHours.toString().padStart(2, '0')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => adjustHours(-1)}
                  style={styles.adjustBtn}
                  activeOpacity={0.7}
                >
                  <Minus size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.timeColon}>:</Text>

              {/* Minutes Column */}
              <View style={styles.pickerColumn}>
                <Text style={styles.columnLabel}>דקות</Text>
                <TouchableOpacity
                  onPress={() => adjustMinutes(5)}
                  style={styles.adjustBtn}
                  activeOpacity={0.7}
                >
                  <Plus size={20} color={Colors.primary} />
                </TouchableOpacity>
                <View style={styles.timeDigitBox}>
                  <Text style={styles.timeDigitText}>
                    {pickerMinutes.toString().padStart(2, '0')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => adjustMinutes(-5)}
                  style={styles.adjustBtn}
                  activeOpacity={0.7}
                >
                  <Minus size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Presets */}
            <Text style={styles.presetsLabel}>שעות נפוצות:</Text>
            <View style={styles.presetsRow}>
              {[
                { h: 6, m: 0, label: '06:00' },
                { h: 6, m: 30, label: '06:30' },
                { h: 7, m: 0, label: '07:00' },
                { h: 7, m: 30, label: '07:30' },
                { h: 8, m: 0, label: '08:00' },
                { h: 8, m: 30, label: '08:30' },
              ].map((p) => {
                const isSelected = pickerHours === p.h && pickerMinutes === p.m;
                return (
                  <TouchableOpacity
                    key={p.label}
                    onPress={() => setPresetTime(p.h, p.m)}
                    style={[
                      styles.presetBadge,
                      isSelected && styles.presetBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetBadgeText,
                        isSelected && styles.presetBadgeTextActive,
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={savePickedTime}
                style={styles.modalSaveBtn}
                activeOpacity={0.88}
              >
                <Text style={styles.modalSaveText}>שמור שעה ✓</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsTimePickerVisible(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>ביטול</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    ...RTL.container,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 36,
    maxWidth: 540,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
    ...RTL.container,
  },
  header: {
    alignItems: RTL.alignRight,
    gap: 4,
  },
  headerBadge: {
    flexDirection: RTL.row,
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
    ...RTL.textRight,
  },
  subtitle: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    ...RTL.textRight,
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
    flexDirection: RTL.row,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardTitleGroup: {
    flex: 1,
    alignItems: RTL.alignRight,
    gap: 2,
  },
  cardTitleRow: {
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 16,
    color: Colors.primary,
    ...RTL.textRight,
  },
  cardDesc: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 18,
    ...RTL.textRight,
  },
  timePickerBox: {
    flexDirection: RTL.row,
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
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 6,
  },
  timePickerLabel: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    ...RTL.textRight,
  },
  timeDisplayBadge: {
    flexDirection: RTL.row,
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
    flexDirection: RTL.row,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  daysTitle: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    ...RTL.textRight,
  },
  daysActiveIndicator: {
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 4,
  },
  daysActiveText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 11,
    color: Colors.secondary,
  },
  daysGrid: {
    flexDirection: RTL.row,
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
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  shabbatNoteText: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 11,
    color: Colors.outline,
    ...RTL.textRight,
  },
  subCardBox: {
    flexDirection: RTL.row,
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
    alignItems: RTL.alignRight,
  },
  subCardTitle: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 13,
    color: Colors.primary,
    ...RTL.textRight,
  },
  subCardSubtitle: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    ...RTL.textRight,
  },
  safetyHeader: {
    flexDirection: RTL.row,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recommendedBadge: {
    flexDirection: RTL.row,
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
    flexDirection: RTL.row,
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
    ...RTL.textRight,
  },
  actionButtons: {
    marginTop: 8,
    gap: 10,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    flexDirection: RTL.row,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 28, 49, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 22,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.cardElevated,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    paddingBottom: 12,
  },
  modalTitle: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 18,
    color: Colors.primary,
    ...RTL.textRight,
  },
  modalCloseBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: Colors.surfaceContainerLow,
  },
  pickerWheelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 18,
  },
  pickerColumn: {
    alignItems: 'center',
    gap: 8,
  },
  columnLabel: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  adjustBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeDigitBox: {
    width: 76,
    height: 64,
    borderRadius: 14,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(254, 206, 87, 0.8)',
  },
  timeDigitText: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 32,
    color: Colors.primary,
  },
  timeColon: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 36,
    color: Colors.primary,
    marginTop: 18,
  },
  presetsLabel: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    ...RTL.textRight,
    marginBottom: 8,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 18,
  },
  presetBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetBadgeActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  presetBadgeText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 12,
    color: Colors.primary,
  },
  presetBadgeTextActive: {
    color: '#FFFFFF',
  },
  modalActions: {
    gap: 8,
  },
  modalSaveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  modalSaveText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  modalCancelBtn: {
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 10,
  },
  testButtonText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 13.5,
    color: Colors.primary,
  },
});
