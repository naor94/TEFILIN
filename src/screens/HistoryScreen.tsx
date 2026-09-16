import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Calendar as CalendarIcon,
  Flame,
  Heart,
  Infinity as InfinityIcon,
  LineChart,
  Share2,
  Shield,
} from 'lucide-react-native';
import { Colors, Shadows } from '../theme/colors';
import { RTL } from '../theme/layout';
import { StorageService } from '../services/storageService';
import { Dedication, TefillinStats } from '../types';

export const HistoryScreen: React.FC = () => {
  const [stats, setStats] = useState<TefillinStats>({
    currentStreak: 14,
    bestStreak: 28,
    monthlyCount: 26,
    monthlyTotalDays: 30,
    totalMitzvot: 142,
  });

  const [dedication, setDedication] = useState<Dedication>({
    type: 'refua',
    name: 'משה בן שרה הי״ו',
    subtext: '״ויהי רצון שתרפאנו רפואת הנפש ורפואת הגוף בתוך שאר חולי עמך ישראל״',
    active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const s = await StorageService.getStats();
    setStats(s);
    const d = await StorageService.getDedication();
    setDedication(d);
  };

  const handleShare = () => {
    Alert.alert(
      'שיתוף הישג',
      `זכיתי להניח תפילין ${stats.currentStreak} ימים ברצף! כל יום הוא עולם מלא ✨`
    );
  };

  const handleDedicationType = async (type: Dedication['type'], defaultName: string, sub: string) => {
    const updated: Dedication = {
      type,
      name: defaultName,
      subtext: sub,
      active: true,
    };
    setDedication(updated);
    await StorageService.saveDedication(updated);
  };

  // לוח 30 ימי החודש
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const isShabbat = (dayNum + 4) % 7 === 0; // שבתות בחודש
    const isCompleted = !isShabbat && dayNum <= 18; // ימים שעברו והושלמו
    const isToday = dayNum === 18; // היום הנוכחי
    return { dayNum, isShabbat, isCompleted, isToday };
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER & SHARE CTA */}
      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.title}>מעקב והישגים</Text>
          <Text style={styles.subtitle}>כל יום הוא עולם מלא</Text>
        </View>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Share2 size={15} color={Colors.onSecondaryContainer} />
          <Text style={styles.shareText}>שתף הישג יומי</Text>
        </TouchableOpacity>
      </View>

      {/* STATS BENTO ROW (3 Metric Cards) */}
      <View style={styles.statsRow}>
        {/* Metric 1: Streak */}
        <View style={styles.statCard}>
          <View style={styles.statIconBoxFlame}>
            <Flame size={16} color={Colors.onSecondaryContainer} />
          </View>
          <Text style={styles.statValue}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>ימי רצף נוכחי</Text>
          <View style={styles.statBadgeGold}>
            <Text style={styles.statBadgeTextGold}>שיא אישי 🔥</Text>
          </View>
        </View>

        {/* Metric 2: Monthly Consistency */}
        <View style={[styles.statCard, { borderColor: 'rgba(197, 155, 39, 0.4)' }]}>
          <View style={styles.statIconBoxBlue}>
            <LineChart size={16} color={Colors.primary} />
          </View>
          <Text style={styles.statValue}>
            {stats.monthlyCount}/{stats.monthlyTotalDays}
          </Text>
          <Text style={styles.statLabel}>ימים החודש</Text>
          <View style={styles.statBadgeBlue}>
            <Text style={styles.statBadgeTextBlue}>88% עקביות</Text>
          </View>
        </View>

        {/* Metric 3: Total Count */}
        <View style={styles.statCard}>
          <View style={styles.statIconBoxGray}>
            <InfinityIcon size={16} color={Colors.onSurfaceVariant} />
          </View>
          <Text style={styles.statValue}>{stats.totalMitzvot}</Text>
          <Text style={styles.statLabel}>סך הכל מצוות</Text>
          <View style={styles.statBadgeGray}>
            <Text style={styles.statBadgeTextGray}>הונחו עד כה</Text>
          </View>
        </View>
      </View>

      {/* MONTHLY CALENDAR TRACKER */}
      <View style={styles.calendarCard}>
        <View style={styles.calendarHeader}>
          <View style={styles.calendarTitleGroup}>
            <View style={styles.calendarIconBox}>
              <CalendarIcon size={16} color="#FFFFFF" />
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.calendarTitle}>חודש אייר ה׳תשפ״ה</Text>
              <Text style={styles.calendarSub}>מעקב עקביות חודשי</Text>
            </View>
          </View>
          <View style={styles.hebrewMonthPill}>
            <Text style={styles.hebrewMonthPillText}>אייר</Text>
          </View>
        </View>

        {/* Days of week */}
        <View style={styles.weekDaysHeader}>
          <Text style={styles.weekDayLabel}>א׳</Text>
          <Text style={styles.weekDayLabel}>ב׳</Text>
          <Text style={styles.weekDayLabel}>ג׳</Text>
          <Text style={styles.weekDayLabel}>ד׳</Text>
          <Text style={styles.weekDayLabel}>ה׳</Text>
          <Text style={styles.weekDayLabel}>ו׳</Text>
          <Text style={[styles.weekDayLabel, { color: Colors.tertiary, fontWeight: '700' }]}>
            שבת
          </Text>
        </View>

        {/* Days Grid */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((d) => (
            <View
              key={d.dayNum}
              style={[
                styles.dayCell,
                d.isShabbat && styles.dayCellShabbat,
                d.isToday && styles.dayCellToday,
                d.isCompleted && styles.dayCellCompleted,
              ]}
            >
              <Text
                style={[
                  styles.dayNumberText,
                  d.isShabbat && styles.dayNumberTextShabbat,
                  d.isToday && styles.dayNumberTextToday,
                ]}
              >
                {d.isShabbat ? 'קודש' : d.dayNum}
              </Text>
              {d.isCompleted && !d.isToday && (
                <View style={styles.completedDot} />
              )}
              {d.isToday && (
                <Text style={styles.todaySubtext}>היום</Text>
              )}
            </View>
          ))}
        </View>

        {/* Calendar Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.secondaryContainer }]} />
            <Text style={styles.legendText}>מצווה הושלמה</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                { backgroundColor: Colors.primary, borderColor: Colors.secondary },
              ]}
            />
            <Text style={styles.legendText}>יום נוכחי</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: Colors.tertiaryContainer }]} />
            <Text style={styles.legendText}>שבת קודש (פטור)</Text>
          </View>
        </View>
      </View>

      {/* DEDICATION & KAVANAH CARD */}
      <View style={styles.dedicationCard}>
        <View style={styles.dedicationGoldAccent} />

        <View style={styles.dedicationHeader}>
          <View style={styles.dedicationTitleGroup}>
            <View style={styles.dedicationIconBox}>
              <Heart size={16} color={Colors.secondary} />
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.dedicationTitle}>הקדשת הנחת התפילין</Text>
              <Text style={styles.dedicationSub}>כוונה מיוחדת לזכות או לעילוי נשמה</Text>
            </View>
          </View>
          <View style={styles.activeDedicationBadge}>
            <Text style={styles.activeDedicationText}>הקדשה פעילה</Text>
          </View>
        </View>

        {/* Active Dedication Box */}
        <View style={styles.activeDedicationBox}>
          <View style={styles.activeDedicationTop}>
            <Text style={styles.activeDedicationCategory}>
              {dedication.type === 'refua'
                ? 'לרפואה שלמה:'
                : dedication.type === 'ilui'
                ? 'לעילוי נשמת:'
                : 'להגנת הלוחמים:'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Alert.prompt
                  ? Alert.prompt(
                      'עריכת שם ההקדשה',
                      'הזן שם מלא (למשל: יוסף בן רחל):',
                      (name) => {
                        if (name) {
                          const updated = { ...dedication, name };
                          setDedication(updated);
                          StorageService.saveDedication(updated);
                        }
                      },
                      'plain-text',
                      dedication.name
                    )
                  : Alert.alert('הקדשה פעילה', dedication.name);
              }}
            >
              <Text style={styles.editDedicationText}>עריכה</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.activeDedicationName}>{dedication.name}</Text>
          <Text style={styles.activeDedicationVerse}>{dedication.subtext}</Text>
        </View>

        {/* Quick Pill Selector */}
        <View style={styles.quickPillsRow}>
          <TouchableOpacity
            style={[
              styles.pillBtn,
              dedication.type === 'refua' && styles.pillBtnActive,
            ]}
            onPress={() =>
              handleDedicationType(
                'refua',
                'משה בן שרה הי״ו',
                '״ויהי רצון שתרפאנו רפואת הנפש ורפואת הגוף...״'
              )
            }
          >
            <Text
              style={[
                styles.pillText,
                dedication.type === 'refua' && styles.pillTextActive,
              ]}
            >
              לרפואת...
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pillBtn,
              dedication.type === 'ilui' && styles.pillBtnActive,
            ]}
            onPress={() =>
              handleDedicationType(
                'ilui',
                'אברהם בן שרה ז״ל',
                '״תְּהֵא נִשְׁמָתוֹ צְרוּרָה בִּצְרוֹר הַחַיִּים״'
              )
            }
          >
            <Text
              style={[
                styles.pillText,
                dedication.type === 'ilui' && styles.pillTextActive,
              ]}
            >
              לעילוי נשמת...
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pillBtn,
              dedication.type === 'soldiers' && styles.pillBtnActive,
            ]}
            onPress={() =>
              handleDedicationType(
                'soldiers',
                'חיילי צה״ל וכוחות הביטחון',
                '״הַקָּדוֹשׁ בָּרוּךְ הוּא יִשְׁמֹר וְיַצִּיל אֶת חַיָּלֵינוּ מִכָּל צָרָה וְצוּקָה״'
              )
            }
          >
            <Shield size={12} color={dedication.type === 'soldiers' ? '#FFFFFF' : Colors.onSurface} />
            <Text
              style={[
                styles.pillText,
                dedication.type === 'soldiers' && styles.pillTextActive,
              ]}
            >
              להגנת חיילי צה״ל
            </Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: RTL.row,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextGroup: {
    alignItems: RTL.alignRight,
  },
  title: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 22,
    color: Colors.primary,
    ...RTL.textRight,
  },
  subtitle: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    ...RTL.textRight,
  },
  shareButton: {
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.secondaryFixed,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    ...Shadows.card,
  },
  shareText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 11,
    color: Colors.onSecondaryContainer,
  },
  statsRow: {
    flexDirection: RTL.row,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surfaceCard,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
    minHeight: 112,
    ...Shadows.card,
  },
  statIconBoxFlame: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(254, 206, 87, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconBoxBlue: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconBoxGray: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 20,
    color: Colors.primary,
    marginTop: 4,
  },
  statLabel: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 10.5,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  statBadgeGold: {
    backgroundColor: 'rgba(255, 223, 152, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    marginTop: 4,
  },
  statBadgeTextGold: {
    fontFamily: 'NotoSans_700Bold',
    fontSize: 9,
    color: Colors.secondary,
  },
  statBadgeBlue: {
    backgroundColor: 'rgba(215, 226, 255, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    marginTop: 4,
  },
  statBadgeTextBlue: {
    fontFamily: 'NotoSans_700Bold',
    fontSize: 9,
    color: Colors.primary,
  },
  statBadgeGray: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    marginTop: 4,
  },
  statBadgeTextGray: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 9,
    color: Colors.onSurfaceVariant,
  },
  calendarCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
    ...Shadows.card,
  },
  calendarHeader: {
    flexDirection: RTL.row,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    paddingBottom: 8,
  },
  calendarTitleGroup: {
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 8,
  },
  calendarIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarTitle: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 14,
    color: Colors.primary,
    ...RTL.textRight,
  },
  calendarSub: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    ...RTL.textRight,
  },
  hebrewMonthPill: {
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  hebrewMonthPillText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 12,
    color: Colors.primary,
  },
  weekDaysHeader: {
    flexDirection: RTL.row,
    justifyContent: 'space-between',
  },
  weekDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'NotoSans_700Bold',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  calendarGrid: {
    flexDirection: RTL.row,
    flexWrap: 'wrap',
    gap: 5,
  },
  dayCell: {
    width: '13%',
    height: 38,
    borderRadius: 8,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  dayCellCompleted: {
    borderColor: 'rgba(197, 155, 39, 0.4)',
  },
  dayCellShabbat: {
    backgroundColor: Colors.tertiaryContainer,
    borderColor: 'rgba(255, 223, 152, 0.4)',
  },
  dayCellToday: {
    backgroundColor: Colors.primary,
    borderColor: Colors.secondary,
    borderWidth: 1.5,
    transform: [{ scale: 1.05 }],
    zIndex: 2,
    ...Shadows.card,
  },
  dayNumberText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 12,
    color: Colors.primary,
  },
  dayNumberTextShabbat: {
    fontSize: 9,
    color: Colors.tertiaryFixed,
    fontWeight: '700',
  },
  dayNumberTextToday: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  todaySubtext: {
    fontSize: 8,
    fontFamily: 'NotoSans_700Bold',
    color: Colors.secondaryFixed,
    marginTop: -2,
  },
  completedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.secondaryContainer,
    position: 'absolute',
    bottom: 3,
  },
  legend: {
    flexDirection: RTL.row,
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendBox: {
    width: 9,
    height: 9,
    borderRadius: 2,
    borderWidth: 1,
  },
  legendText: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  dedicationCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
    gap: 10,
    ...Shadows.card,
  },
  dedicationGoldAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.secondary,
  },
  dedicationHeader: {
    flexDirection: RTL.row,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dedicationTitleGroup: {
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 8,
  },
  dedicationIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 223, 152, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dedicationTitle: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 14,
    color: Colors.primary,
    ...RTL.textRight,
  },
  dedicationSub: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    ...RTL.textRight,
  },
  activeDedicationBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeDedicationText: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  activeDedicationBox: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 10,
    padding: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeDedicationTop: {
    flexDirection: RTL.row,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeDedicationCategory: {
    fontFamily: 'NotoSans_700Bold',
    fontSize: 12,
    color: Colors.secondary,
    ...RTL.textRight,
  },
  editDedicationText: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 11,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  activeDedicationName: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 15,
    color: Colors.primary,
    ...RTL.textRight,
  },
  activeDedicationVerse: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    ...RTL.textRight,
  },
  quickPillsRow: {
    flexDirection: RTL.row,
    gap: 6,
    flexWrap: 'wrap',
  },
  pillBtn: {
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  pillBtnActive: {
    backgroundColor: Colors.primary,
  },
  pillText: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 11.5,
    color: Colors.onSurface,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
});
