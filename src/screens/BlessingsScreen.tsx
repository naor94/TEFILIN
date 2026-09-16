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
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Volume2,
} from 'lucide-react-native';
import { Colors, Shadows } from '../theme/colors';
import { RTL } from '../theme/layout';
import { StorageService } from '../services/storageService';
import { Nusach } from '../types';

interface BlessingsScreenProps {
  onComplete?: () => void;
}

export const BlessingsScreen: React.FC<BlessingsScreenProps> = ({ onComplete }) => {
  const [nusach, setNusach] = useState<Nusach>('edot');
  const [isShemaOpen, setIsShemaOpen] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    loadNusach();
  }, []);

  const loadNusach = async () => {
    const saved = await StorageService.getNusach();
    setNusach(saved);
  };

  const handleNusachChange = async (newNusach: Nusach) => {
    setNusach(newNusach);
    await StorageService.setNusach(newNusach);
  };

  const handleComplete = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    await StorageService.toggleTodayStatus();
    setCompleted(true);
    Alert.alert(
      'זכית במצווה! ✨',
      'אשריך ישראל! סדר הנחת תפילין וקריאת שמע הושלמו בהצלחה ונרשמו בלוח היומי.',
      [{ text: 'אמן', onPress: onComplete }]
    );
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP BAR / AUDIO RECITER */}
        <View style={styles.topHeader}>
          <View style={styles.topTitleBox}>
            <Text style={styles.topTitle}>סדר הנחת תפילין</Text>
            <Text style={styles.topSub}>ברכות, הדרכה וכוונה מדויקת</Text>
          </View>
          <TouchableOpacity
            style={styles.audioButton}
            onPress={() => {
              Alert.alert(
                'האזנה לברכות',
                'השמעת ברכות התפילין בנוסח נבחר להקשבה ולדיוק בהגייה.'
              );
            }}
            activeOpacity={0.8}
          >
            <Volume2 size={16} color={Colors.secondary} />
            <Text style={styles.audioText}>האזנה</Text>
          </TouchableOpacity>
        </View>

        {/* NUSACH SELECTOR */}
        <View style={styles.nusachSelector}>
          <TouchableOpacity
            style={[
              styles.nusachTab,
              nusach === 'edot' && styles.nusachTabActive,
            ]}
            onPress={() => handleNusachChange('edot')}
          >
            <Text
              style={[
                styles.nusachTabText,
                nusach === 'edot' && styles.nusachTabTextActive,
              ]}
            >
              עדות המזרח
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nusachTab,
              nusach === 'ashkenaz' && styles.nusachTabActive,
            ]}
            onPress={() => handleNusachChange('ashkenaz')}
          >
            <Text
              style={[
                styles.nusachTabText,
                nusach === 'ashkenaz' && styles.nusachTabTextActive,
              ]}
            >
              אשכנז
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nusachTab,
              nusach === 'sfard' && styles.nusachTabActive,
            ]}
            onPress={() => handleNusachChange('sfard')}
          >
            <Text
              style={[
                styles.nusachTabText,
                nusach === 'sfard' && styles.nusachTabTextActive,
              ]}
            >
              ספרד
            </Text>
          </TouchableOpacity>
        </View>

        {/* KAVANAH & PREPARATION BANNER */}
        <View style={styles.kavanahBanner}>
          <View style={styles.kavanahIconBox}>
            <Lightbulb size={18} color={Colors.secondary} />
          </View>
          <View style={styles.kavanahContent}>
            <Text style={styles.kavanahTitle}>כוונת המצווה</Text>
            <Text style={styles.kavanahText}>
              יכוון בהנחתם שציוונו הקב״ה להניח ארבע פרשיות אלו, שיש בהן ייחוד שמו ויציאת מצרים, על הזרוע כנגד הלב ועל הראש כנגד המוח.
            </Text>
          </View>
        </View>

        {/* STEP 1: תפילין של יד */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepTitleRow}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepTitle}>תפילין של יד</Text>
            </View>
            <View style={styles.stepTag}>
              <Text style={styles.stepTagText}>הנחה ראשונה</Text>
            </View>
          </View>

          <Text style={styles.stepDesc}>
            מניח את בית התפילה על הקיבורת (השריר התפוח) ביד כהה (שמאל לימני, ימין לאיטר), ונוטה מעט כלפי הלב. לפני הידוק הקשר מברך:
          </Text>

          <View style={styles.blessingBox}>
            <Text style={styles.blessingText}>
              בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ לְהָנִיחַ תְּפִלִּין.
            </Text>
          </View>

          <View style={styles.warningBox}>
            <AlertTriangle size={16} color={Colors.secondary} />
            <Text style={styles.warningText}>
              הערה חשובה: אסור להפסיק בדיבור עד לאחר הנחת תפילין של ראש!
            </Text>
          </View>
        </View>

        {/* STEP 2: כריכות הזרוע */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepTitleRow}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepTitle}>כריכות הזרוע (7 כריכות)</Text>
            </View>
            <Text style={styles.stepSubTag}>הידוק הרצועה</Text>
          </View>

          <Text style={styles.stepDesc}>
            מהדק את הקשר על הזרוע וכורך שבע כריכות סביב הזרוע כלפי מטה עד פרק כף היד, ואומר את הפסוק:
          </Text>

          <View style={styles.verseBox}>
            <Text style={styles.verseText}>
              ״וַיְדַבֵּר יְהוָה אֶל מֹשֶׁה לֵּאמֹר: קַדֶּשׁ לִי כָל בְּכוֹר פֶּטֶר כָּל רֶחֶם בִּבְנֵי יִשְׂרָאֵל...״
            </Text>
          </View>
        </View>

        {/* STEP 3: תפילין של ראש */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepTitleRow}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepTitle}>תפילין של ראש</Text>
            </View>
            <View style={styles.stepTag}>
              <Text style={styles.stepTagText}>מנהגי עדות</Text>
            </View>
          </View>

          <Text style={styles.stepDesc}>
            מניח את התשב״ר על הראש מעל קו שורשי השערות בדיוק בין העיניים, והקשר מאחור בשקע העורף.
          </Text>

          {nusach === 'edot' ? (
            <View style={styles.edotBox}>
              <Text style={styles.edotTitle}>לפי מנהג עדות המזרח:</Text>
              <Text style={styles.edotDesc}>
                אין מברכים על של ראש (אלא אם דיבר או הפסיק בין של יד לשל ראש).
              </Text>
              <View style={styles.baruchShemBox}>
                <Text style={styles.baruchShemLabel}>לאחר ההנחה:</Text>
                <Text style={styles.baruchShemText}>
                  בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.ashkenazBox}>
              <Text style={styles.ashkenazTitle}>
                לנוהגים לברך ({nusach === 'ashkenaz' ? 'מנהג אשכנז' : 'מנהג ספרד'}):
              </Text>
              <Text style={styles.blessingText}>
                בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ עַל מִצְוַת תְּפִלִּין.
              </Text>
              <View style={styles.baruchShemBox}>
                <Text style={styles.baruchShemLabel}>לאחר ההידוק אומר:</Text>
                <Text style={styles.baruchShemText}>
                  בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* STEP 4: כריכות האצבע */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepTitleRow}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepTitle}>כריכות האצבע והכף</Text>
            </View>
            <Text style={styles.stepSubTag}>סיום הקשירה</Text>
          </View>

          <Text style={styles.stepDesc}>
            כורך 3 כריכות על האצבע האמצעית (אחת בפרק האמצעי ושתיים בתחתון), ובכל כריכה אומר פסוק של אירוסין:
          </Text>

          <View style={styles.erusinBox}>
            <Text style={styles.erusinText}>וְאֵרַשְׂתִּיךְ לִי לְעוֹלָם,</Text>
            <Text style={styles.erusinText}>
              וְאֵרַשְׂתִּיךְ לִי בְּצֶדֶק וּבְמִשְׁפָּט וּבְחֶסֶד וּבְרַחֲמִים,
            </Text>
            <Text style={styles.erusinText}>
              וְאֵרַשְׂתִּיךְ לִי בֶּאֱמוּנָה, וְיָדַעַתְּ אֶת ה'.
            </Text>
          </View>
        </View>

        {/* STEP 5: קריאת שמע (Accordion) */}
        <View style={styles.stepCard}>
          <TouchableOpacity
            style={styles.shemaHeader}
            onPress={() => setIsShemaOpen(!isShemaOpen)}
            activeOpacity={0.8}
          >
            <View style={styles.stepTitleRow}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>5</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.stepTitle}>קריאת שמע עם התפילין</Text>
                <Text style={styles.shemaSub}>חובה מדאורייתא לקרוא עמן פרשת שמע</Text>
              </View>
            </View>
            {isShemaOpen ? (
              <ChevronUp size={22} color={Colors.primary} />
            ) : (
              <ChevronDown size={22} color={Colors.primary} />
            )}
          </TouchableOpacity>

          {isShemaOpen && (
            <View style={styles.shemaContent}>
              <Text style={styles.shemaPassuk}>
                שְׁמַע יִשְׂרָאֵל, ה' אֱלֹהֵינוּ, ה' אֶחָד:
              </Text>
              <Text style={styles.shemaBalat}>
                (בלחש:) בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד.
              </Text>
              <View style={styles.divider} />
              <Text style={styles.veahavtaText}>
                וְאָהַבְתָּ אֵת ה' אֱלֹהֶיךָ בְּכָל לְבָבְךָ וּבְכָל נַפְשְׁךָ וּבְכָל מְאֹדֶךָ. וְהָיוּ הַדְּבָרִים הָאֵלֶּה אֲשֶׁר אָנֹכִי מְצַוְּךָ הַיּוֹם עַל לְבָבֶךָ. וְשִׁנַּנְתָּם לְבָנֶיךָ וְדִבַּרְתָּ בָּם בְּשִׁבְתְּךָ בְּבֵיתֶךָ וּבְלֶכְתְּךָ בַדֶּרֶךְ וּבְשָׁכְבְּךָ וּבְקוּמֶךָ. וּקְשַׁרְתָּם לְאוֹת עַל יָדֶךָ וְהָיוּ לְטֹטָפֹת בֵּין עֵינֶיךָ. וּכְתַבְתָּם עַל מְזֻזוֹת בֵּיתֶךָ וּבִשְׁעָרֶיךָ.
              </Text>
            </View>
          )}
        </View>

        {/* BOTTOM COMPLETION BUTTON */}
        <TouchableOpacity
          style={[styles.completeBtn, completed && styles.completeBtnDone]}
          onPress={handleComplete}
          activeOpacity={0.88}
        >
          <CheckCircle2 size={22} color="#FFFFFF" />
          <Text style={styles.completeBtnText}>
            {completed ? 'זכית! סדר ההנחה הושלם ✨' : 'סיימתי את סדר ההנחה ✓'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    ...RTL.container,
  },
  container: {
    flex: 1,
    ...RTL.container,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 40,
    maxWidth: 540,
    width: '100%',
    alignSelf: 'center',
    gap: 14,
    ...RTL.container,
  },
  topHeader: {
    flexDirection: RTL.row,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  topTitleBox: {
    alignItems: RTL.alignRight,
  },
  topTitle: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 22,
    color: Colors.primary,
    ...RTL.textRight,
  },
  topSub: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    ...RTL.textRight,
  },
  audioButton: {
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 223, 152, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(254, 206, 87, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  audioText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 12,
    color: Colors.secondary,
  },
  nusachSelector: {
    flexDirection: RTL.row,
    backgroundColor: Colors.surfaceContainerHigh,
    padding: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nusachTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  nusachTabActive: {
    backgroundColor: Colors.primary,
    ...Shadows.card,
  },
  nusachTabText: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  nusachTabTextActive: {
    fontFamily: 'Rubik_600SemiBold',
    color: '#FFFFFF',
  },
  kavanahBanner: {
    flexDirection: RTL.row,
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(197, 155, 39, 0.3)',
    borderRadius: 14,
    padding: 12,
  },
  kavanahIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 223, 152, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  kavanahContent: {
    flex: 1,
    alignItems: RTL.alignRight,
  },
  kavanahTitle: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 13,
    color: Colors.primary,
    ...RTL.textRight,
  },
  kavanahText: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 11.5,
    color: Colors.onSurfaceVariant,
    lineHeight: 17,
    ...RTL.textRight,
  },
  stepCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
    gap: 10,
  },
  stepHeader: {
    flexDirection: RTL.row,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    paddingBottom: 8,
  },
  stepTitleRow: {
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 8,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  stepTitle: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 16,
    color: Colors.primary,
    ...RTL.textRight,
  },
  stepTag: {
    backgroundColor: 'rgba(255, 223, 152, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  stepTagText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 10.5,
    color: Colors.secondary,
  },
  stepSubTag: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    ...RTL.textRight,
  },
  stepDesc: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    ...RTL.textRight,
  },
  blessingBox: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRightWidth: 4,
    borderRightColor: Colors.secondary,
    borderRadius: 10,
    padding: 14,
  },
  blessingText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 26,
  },
  warningBox: {
    flexDirection: RTL.row,
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 223, 152, 0.25)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(197, 155, 39, 0.25)',
  },
  warningText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 11,
    color: Colors.secondary,
    flex: 1,
    ...RTL.textRight,
  },
  verseBox: {
    backgroundColor: Colors.surfaceContainerLow,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  verseText: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 22,
  },
  edotBox: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 10,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  edotTitle: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    ...RTL.textRight,
  },
  edotDesc: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 13,
    color: Colors.primary,
    ...RTL.textRight,
  },
  ashkenazBox: {
    gap: 8,
  },
  ashkenazTitle: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 12,
    color: Colors.secondary,
    ...RTL.textRight,
  },
  baruchShemBox: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  baruchShemLabel: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 10.5,
    color: Colors.onSurfaceVariant,
    marginBottom: 2,
  },
  baruchShemText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 14,
    color: Colors.primary,
  },
  erusinBox: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRightWidth: 3,
    borderRightColor: Colors.secondary,
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  erusinText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
  },
  shemaHeader: {
    flexDirection: RTL.row,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shemaSub: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    ...RTL.textRight,
  },
  shemaContent: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(197, 155, 39, 0.3)',
  },
  shemaPassuk: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 18,
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 28,
  },
  shemaBalat: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  veahavtaText: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 13.5,
    color: Colors.primary,
    lineHeight: 22,
    ...RTL.textRight,
  },
  completeBtn: {
    backgroundColor: Colors.primary,
    flexDirection: RTL.row,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
    ...Shadows.cardElevated,
  },
  completeBtnDone: {
    backgroundColor: Colors.secondary,
  },
  completeBtnText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
