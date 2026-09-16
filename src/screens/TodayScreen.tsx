import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  BookOpen,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Compass,
  Flame,
  Hourglass,
  Sparkles,
  Sun,
} from 'lucide-react-native';
import { Colors, Shadows } from '../theme/colors';
import { RTL } from '../theme/layout';
import { calculateZmanim } from '../services/zmanimService';
import { StorageService } from '../services/storageService';
import { ZmanimTimes } from '../types';
import { TabKey } from '../components/BottomNavBar';

interface TodayScreenProps {
  onNavigate: (tab: TabKey) => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({ onNavigate }) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [zmanim, setZmanim] = useState<ZmanimTimes>(calculateZmanim());
  const [streakCount, setStreakCount] = useState<number>(14);

  useEffect(() => {
    loadData();
    const timer = setInterval(() => {
      setZmanim(calculateZmanim());
    }, 60000); // רענון זמנים כל דקה
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    const status = await StorageService.getTodayStatus();
    setIsCompleted(status);
    const stats = await StorageService.getStats();
    setStreakCount(stats.currentStreak);
  };

  const handleToggle = async () => {
    try {
      await Haptics.notificationAsync(
        isCompleted
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Success
      );
    } catch {
      // רטט אינו זמין בווב / סימולטור
    }

    const newStatus = await StorageService.toggleTodayStatus();
    setIsCompleted(newStatus);
    const stats = await StorageService.getStats();
    setStreakCount(stats.currentStreak);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. DATE & STREAK META BAR */}
      <View style={styles.metaBar}>
        <View style={styles.metaDate}>
          <Text style={styles.metaDateLabel}>היום: </Text>
          <Text style={styles.metaDateValue}>{zmanim.hebrewDateStr}</Text>
        </View>
        <View style={styles.streakBadge}>
          <Flame size={14} color={Colors.onSecondaryContainer} />
          <Text style={styles.streakText}>{streakCount} ימים ברצף!</Text>
        </View>
      </View>

      {/* 2. HERO SECTION: TEFILLIN STATUS CARD */}
      <View
        style={[
          styles.heroCard,
          isCompleted && styles.heroCardCompleted,
        ]}
      >
        <View style={styles.heroGoldTopBar} />

        <View style={styles.heroHeader}>
          <View style={styles.heroTitleBlock}>
            <View style={styles.tagMitzvah}>
              <Text style={styles.tagMitzvahText}>מצוות עשה שהזמן גרמא</Text>
            </View>
            <Text style={styles.heroTitle}>
              {isCompleted ? 'יישר כוחך! המצווה הושלמה' : 'הנחת תפילין היום?'}
            </Text>
          </View>
          <View
            style={[
              styles.statusIconBubble,
              isCompleted && styles.statusIconBubbleCompleted,
            ]}
          >
            {isCompleted ? (
              <CheckCircle2 size={24} color={Colors.secondary} />
            ) : (
              <Sparkles size={22} color={Colors.primary} />
            )}
          </View>
        </View>

        {/* Motivational Verse */}
        <View style={styles.verseBox}>
          <Text style={styles.verseText}>
            "וּקְשַׁרְתָּ֥ם לְא֖וֹת עַל־יָדֶ֑ךָ וְהָי֥וּ לְטֹטָפֹ֖ת בֵּ֥ין עֵינֶֽיךָ"
          </Text>
        </View>

        {/* Hero Interactive CTA Button */}
        <TouchableOpacity
          onPress={handleToggle}
          activeOpacity={0.88}
          style={[
            styles.ctaButton,
            isCompleted && styles.ctaButtonCompleted,
          ]}
        >
          {isCompleted ? (
            <Check size={22} color="#FFFFFF" strokeWidth={3} />
          ) : (
            <CheckCheck size={22} color="#FFFFFF" strokeWidth={2.5} />
          )}
          <Text style={styles.ctaButtonText}>
            {isCompleted ? 'זכית! הנחת היום ✨' : 'הנחתי תפילין היום! ✨'}
          </Text>
        </TouchableOpacity>

        {isCompleted && (
          <Text style={styles.completionSubtext}>
            אשריך ישראל! המצווה נרשמה בהצלחה בלוח היומי. לחץ שוב לביטול.
          </Text>
        )}
      </View>

      {/* 3. ZMANIM SECTION */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Clock size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>זמני היום בהלכה להנחת תפילין</Text>
          </View>
          <Text style={styles.sectionSubtitle}>ירושלים (מג״א וגר״א)</Text>
        </View>

        {/* 2x2 Bento Grid */}
        <View style={styles.zmanimGrid}>
          {/* משיכיר */}
          <View style={styles.zmanCard}>
            <View style={styles.zmanCardTop}>
              <Text style={styles.zmanTag}>תחילת זמן</Text>
              <View style={styles.dotIndicator} />
            </View>
            <Text style={styles.zmanTime}>{zmanim.misheyakir}</Text>
            <Text style={styles.zmanLabel}>משיכיר</Text>
          </View>

          {/* הנץ החמה */}
          <View style={styles.zmanCard}>
            <View style={styles.zmanCardTop}>
              <Text style={styles.zmanTag}>לכתחילה עפ״י סוד</Text>
              <Sun size={15} color={Colors.secondary} />
            </View>
            <Text style={styles.zmanTime}>{zmanim.sunrise}</Text>
            <Text style={styles.zmanLabel}>הנץ החמה</Text>
          </View>

          {/* סוף זמן תפילה (מג״א) */}
          <View style={styles.zmanCard}>
            <View style={styles.zmanCardTop}>
              <Text style={styles.zmanTag}>סוף זמן ק״ש ותפילה</Text>
              <View style={[styles.dotIndicator, { backgroundColor: Colors.outlineVariant }]} />
            </View>
            <Text style={styles.zmanTime}>{zmanim.sofZmanTefillaMaga}</Text>
            <Text style={styles.zmanLabel}>סוף זמן תפילה (מג״א)</Text>
          </View>

          {/* שקיעת החמה */}
          <View style={[styles.zmanCard, styles.zmanCardHighlight]}>
            <View style={styles.zmanCardTop}>
              <Text style={[styles.zmanTag, { color: Colors.error, fontWeight: '700' }]}>
                סוף זמן ההנחה
              </Text>
              <Hourglass size={15} color={Colors.error} />
            </View>
            <Text style={styles.zmanTime}>{zmanim.sunset}</Text>
            <Text style={styles.zmanLabel}>שקיעת החמה</Text>

            <View style={styles.countdownBadge}>
              <Text style={styles.countdownText}>{zmanim.remainingUntilSunset}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 4. QUICK ACTION BAR */}
      <View style={styles.quickGrid}>
        {/* Shortcut 1: סדר הברכות */}
        <TouchableOpacity
          style={styles.quickCard}
          activeOpacity={0.8}
          onPress={() => onNavigate('order')}
        >
          <View style={styles.quickCardContent}>
            <View style={styles.quickIconBoxBlue}>
              <BookOpen size={20} color={Colors.primary} />
            </View>
            <View style={styles.quickTexts}>
              <Text style={styles.quickTitle}>סדר הברכות</Text>
              <Text style={styles.quickSub}>נוסח ע״מ, אשכנז וספרד</Text>
            </View>
          </View>
          <ChevronLeft size={18} color={Colors.outlineVariant} />
        </TouchableOpacity>

        {/* Shortcut 2: כיוון התפילה */}
        <TouchableOpacity
          style={styles.quickCard}
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert(
              'כיוון התפילה לירושלים',
              'כיוון התפילה בכל רחבי הארץ והעולם מכוון אל מקום המקדש בהר הבית שבירושלים.'
            );
          }}
        >
          <View style={styles.quickCardContent}>
            <View style={styles.quickIconBoxGold}>
              <Compass size={20} color={Colors.secondary} />
            </View>
            <View style={styles.quickTexts}>
              <Text style={styles.quickTitle}>כיוון התפילה</Text>
              <Text style={styles.quickSub}>מצפן לירושלים והמקדש</Text>
            </View>
          </View>
          <ChevronLeft size={18} color={Colors.outlineVariant} />
        </TouchableOpacity>
      </View>

      {/* 5. DAILY HALACHA / QUOTE */}
      <View style={styles.pninatCard}>
        <View style={styles.pninatIconBox}>
          <Sparkles size={18} color={Colors.secondary} />
        </View>
        <View style={styles.pninatContent}>
          <Text style={styles.pninatCategory}>פנינת היום</Text>
          <Text style={styles.pninatQuote}>
            "מצוות תפילין שקולה כנגד כל המצוות כולן"
          </Text>
          <Text style={styles.pninatSource}>מדרש תנחומא, פרשת וזאת הברכה</Text>
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
    paddingBottom: 24,
    maxWidth: 540,
    width: '100%',
    alignSelf: 'center',
    gap: 18,
  },
  metaBar: {
    flexDirection: RTL.row,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metaDate: {
    flexDirection: RTL.row,
    alignItems: 'center',
  },
  metaDateLabel: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    ...RTL.textRight,
  },
  metaDateValue: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 13,
    color: Colors.primary,
    ...RTL.textRight,
  },
  streakBadge: {
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 223, 152, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  streakText: {
    fontFamily: 'NotoSans_700Bold',
    fontSize: 12,
    color: Colors.onSecondaryContainer,
  },
  heroCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.card,
  },
  heroCardCompleted: {
    borderColor: Colors.secondary,
    backgroundColor: '#FDFBF4',
  },
  heroGoldTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: Colors.secondaryContainer,
  },
  heroHeader: {
    flexDirection: RTL.row,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroTitleBlock: {
    alignItems: RTL.alignRight,
    flex: 1,
  },
  tagMitzvah: {
    backgroundColor: 'rgba(255, 223, 152, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  tagMitzvahText: {
    fontFamily: 'NotoSans_700Bold',
    fontSize: 10,
    color: Colors.secondary,
    ...RTL.textRight,
  },
  heroTitle: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 22,
    color: Colors.primary,
    ...RTL.textRight,
  },
  statusIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconBubbleCompleted: {
    backgroundColor: 'rgba(254, 206, 87, 0.25)',
  },
  verseBox: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRightWidth: 3,
    borderRightColor: Colors.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  verseText: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    ...RTL.textRight,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    flexDirection: RTL.row,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    ...Shadows.card,
  },
  ctaButtonCompleted: {
    backgroundColor: Colors.secondary,
  },
  ctaButtonText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 17,
    color: '#FFFFFF',
  },
  completionSubtext: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 12,
    color: Colors.secondary,
    ...RTL.textCenter,
    marginTop: 10,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: RTL.row,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 15,
    color: Colors.primary,
    ...RTL.textRight,
  },
  sectionSubtitle: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    ...RTL.textRight,
  },
  zmanimGrid: {
    flexDirection: RTL.row,
    flexWrap: 'wrap',
    gap: 10,
  },
  zmanCard: {
    width: '48.4%',
    backgroundColor: Colors.surfaceCard,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
    minHeight: 90,
  },
  zmanCardHighlight: {
    borderColor: 'rgba(254, 206, 87, 0.7)',
    backgroundColor: '#FFFEFB',
  },
  zmanCardTop: {
    flexDirection: RTL.row,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zmanTag: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    ...RTL.textRight,
  },
  dotIndicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  zmanTime: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 20,
    color: Colors.primary,
    ...RTL.textRight,
    marginTop: 4,
  },
  zmanLabel: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 12,
    color: Colors.onSurface,
    ...RTL.textRight,
  },
  countdownBadge: {
    marginTop: 6,
    backgroundColor: 'rgba(255, 223, 152, 0.4)',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  countdownText: {
    fontFamily: 'NotoSans_700Bold',
    fontSize: 10,
    color: Colors.onSecondaryContainer,
  },
  quickGrid: {
    flexDirection: 'column',
    gap: 10,
  },
  quickCard: {
    flexDirection: RTL.row,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceCard,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickCardContent: {
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 10,
  },
  quickIconBoxBlue: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIconBoxGold: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 223, 152, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTexts: {
    alignItems: RTL.alignRight,
  },
  quickTitle: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 14,
    color: Colors.primary,
    ...RTL.textRight,
  },
  quickSub: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    ...RTL.textRight,
  },
  pninatCard: {
    flexDirection: RTL.row,
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.surfaceCard,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pninatIconBox: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 223, 152, 0.3)',
    marginTop: 2,
  },
  pninatContent: {
    flex: 1,
    alignItems: RTL.alignRight,
  },
  pninatCategory: {
    fontFamily: 'NotoSans_700Bold',
    fontSize: 10,
    color: Colors.secondary,
    textTransform: 'uppercase',
    ...RTL.textRight,
  },
  pninatQuote: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 14,
    color: Colors.primary,
    marginTop: 3,
    lineHeight: 20,
    ...RTL.textRight,
  },
  pninatSource: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    ...RTL.textRight,
  },
});
