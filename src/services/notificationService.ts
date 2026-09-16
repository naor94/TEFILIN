import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ReminderSettings } from '../types';

// הגדרת טיפול בהתראות כאשר האפליקציה פתוחה (Foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const CHANNEL_ID = 'tefillin-reminders-v1';

export const NotificationService = {
  /**
   * אתחול ערוץ התראות לאנדרואיד ובקשת הרשאות
   */
  async init(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
          name: 'תזכורות תפילין',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#C59B27',
          sound: 'default',
          enableVibrate: true,
          showBadge: true,
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (err) {
      console.warn('Error initializing notifications:', err);
      return false;
    }
  },

  /**
   * ביטול כל ההתראות המתוזמנות
   */
  async cancelAll(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (err) {
      console.warn('Error cancelling notifications:', err);
    }
  },

  /**
   * תזמון התראות לפי הגדרות המשתמש
   */
  async scheduleReminders(settings: ReminderSettings): Promise<boolean> {
    try {
      const hasPermission = await this.init();
      if (!hasPermission) {
        return false;
      }

      // מנקים תזמונים ישנים כדי לא לשכפל
      await this.cancelAll();

      if (!settings.morningEnabled) {
        return true;
      }

      const [hoursStr, minutesStr] = settings.morningTime.split(':');
      const hour = parseInt(hoursStr, 10);
      const minute = parseInt(minutesStr, 10);

      // תזמון יומי קבוע לשעת הבוקר
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'אות וזיכרון • זמן הנחת תפילין ✨',
          body: 'בוקר טוב! הגיע זמן היעד שלך להנחת תפילין בנחת.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
          data: { screen: 'today' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
          channelId: CHANNEL_ID,
        },
      });

      return true;
    } catch (err) {
      console.warn('Error scheduling reminders:', err);
      return false;
    }
  },

  /**
   * שליחת התראת בדיקה מיידית (בעוד 2 שניות) לווידוא צליל ורטט במכשיר
   */
  async triggerTestNotification(): Promise<boolean> {
    try {
      const hasPermission = await this.init();
      if (!hasPermission) {
        return false;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'בדיקת צליל והתראה • אות וזיכרון 🔔',
          body: 'התזכורת פועלת בהצלחה עם צליל ורטט!',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
          data: { test: true },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
          channelId: CHANNEL_ID,
        },
      });

      return true;
    } catch (err) {
      console.warn('Error triggering test notification:', err);
      return false;
    }
  },
};
