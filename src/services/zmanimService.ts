import * as SunCalc from 'suncalc';
import { ZmanimTimes } from '../types';

// ברירת מחדל: ירושלים
const DEFAULT_LAT = 31.7683;
const DEFAULT_LNG = 35.2137;

function formatTime(date: Date): string {
  if (!date || isNaN(date.getTime())) return '--:--';
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function calculateZmanim(
  date: Date = new Date(),
  lat: number = DEFAULT_LAT,
  lng: number = DEFAULT_LNG
): ZmanimTimes {
  const times = SunCalc.getTimes(date, lat, lng);
  
  const sunrise = times.sunrise || new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 4);
  const sunset = times.sunset || new Date(date.getFullYear(), date.getMonth(), date.getDate(), 19, 28);
  
  // משיכיר (משוער: כ-52 דקות לפני הנץ בירושלים / שמש ב-11.5 מעלות)
  const misheyakirDate = new Date(sunrise.getTime() - 52 * 60 * 1000);
  
  // חישוב שעות זמניות לגר"א (נץ עד שקיעה חלקי 12)
  const dayDurationMs = sunset.getTime() - sunrise.getTime();
  const shaahZmanitGraMs = dayDurationMs / 12;
  
  // סוף זמן תפילה גר"א (4 שעות זמניות מהנץ)
  const sofZmanTefillaGraDate = new Date(sunrise.getTime() + 4 * shaahZmanitGraMs);
  
  // סוף זמן תפילה מג"א (מעלות השחר: כ-72 דקות לפני הנץ)
  const alotHashacharMs = sunrise.getTime() - 72 * 60 * 1000;
  const tzeitHakochavimMs = sunset.getTime() + 42 * 60 * 1000;
  const shaahZmanitMagaMs = (tzeitHakochavimMs - alotHashacharMs) / 12;
  const sofZmanTefillaMagaDate = new Date(alotHashacharMs + 4 * shaahZmanitMagaMs);
  
  // חישוב זמן שנותר עד השקיעה
  const now = new Date();
  const diffMs = sunset.getTime() - now.getTime();
  const isAfterSunset = diffMs <= 0;
  
  let remainingUntilSunset = '';
  if (isAfterSunset) {
    remainingUntilSunset = 'עבר זמן השקיעה להיום';
  } else {
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      remainingUntilSunset = `נותרו ${hours} שעות ו-${minutes} דקות`;
    } else {
      remainingUntilSunset = `נותרו ${minutes} דקות בלבד!`;
    }
  }

  // בדיקת שבת (מיום שישי בשקיעה עד מוצאי שבת)
  const dayOfWeek = now.getDay(); // 0=Sun, ..., 5=Fri, 6=Sat
  let isShabbatOrYomTov = false;
  if (dayOfWeek === 5 && now >= new Date(sunset.getTime() - 20 * 60 * 1000)) {
    // יום שישי לאחר כניסת שבת (20 דק' לפני שקיעה)
    isShabbatOrYomTov = true;
  } else if (dayOfWeek === 6 && now <= new Date(sunset.getTime() + 40 * 60 * 1000)) {
    // שבת קודש עד צאת השבת
    isShabbatOrYomTov = true;
  }

  return {
    misheyakir: formatTime(misheyakirDate),
    sunrise: formatTime(sunrise),
    sofZmanTefillaMaga: formatTime(sofZmanTefillaMagaDate),
    sofZmanTefillaGra: formatTime(sofZmanTefillaGraDate),
    sunset: formatTime(sunset),
    remainingUntilSunset,
    isAfterSunset,
    isShabbatOrYomTov,
    hebrewDateStr: getHebrewDateString(now),
  };
}

// המרת תאריך עברי לתצוגה חמה ומדויקת
export function getHebrewDateString(date: Date = new Date()): string {
  const daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const dayName = daysOfWeek[date.getDay()];
  
  try {
    // שימוש ב-Intl API המובנה ב-JS/V8 לקבלת לוח שנה עברי
    const formatter = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const formatted = formatter.format(date);
    return `יום ${dayName}, ${formatted}`;
  } catch {
    return `יום ${dayName}, י״ד אייר תשפ״ה`;
  }
}
