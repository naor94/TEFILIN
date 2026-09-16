export type Nusach = 'edot' | 'ashkenaz' | 'sfard';

export interface ZmanimTimes {
  misheyakir: string;            // משיכיר (Earliest Tefillin)
  sunrise: string;               // הנץ החמה
  sofZmanTefillaMaga: string;    // סוף זמן תפילה מג"א
  sofZmanTefillaGra: string;     // סוף זמן תפילה גר"א
  sunset: string;                // שקיעת החמה
  remainingUntilSunset: string;  // זמן שנותר עד שקיעה
  isAfterSunset: boolean;
  isShabbatOrYomTov: boolean;
  hebrewDateStr: string;         // תאריך עברי מלא (למשל: י"ד אייר תשפ"ה)
}

export interface ReminderSettings {
  morningEnabled: boolean;
  morningTime: string;          // HH:mm format, e.g. "07:30"
  activeDays: number[];         // 0=א, 1=ב, 2=ג, 3=ד, 4=ה, 5=ו. 6 (שבת) תמיד מושבתת
  zmanimAlertEnabled: boolean;
  zmanimOffsetMinutes: number;  // למשל 30 דקות לפני סוף זמן תפילה
  sunsetSafetyEnabled: boolean; // התראת רגע אחרון לפני שקיעה
  sunsetOffsetMinutes: number;  // למשל 60 דקות לפני שקיעה
  sound: string;                // 'shofar' | 'gentle' | 'chime'
  snoozeMinutes: number;        // 15
}

export interface Dedication {
  type: 'refua' | 'ilui' | 'soldiers' | 'custom';
  name: string;
  subtext: string;
  active: boolean;
}

export interface TefillinStats {
  currentStreak: number;
  bestStreak: number;
  monthlyCount: number;
  monthlyTotalDays: number;
  totalMitzvot: number;
}
