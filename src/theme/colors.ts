export const Colors = {
  // Brand & Core Tokens
  primary: '#1B2B48',              // Royal Navy - שמיים וקדושה
  primaryContainer: '#0F1C31',     // עמוק יותר
  primaryFixed: '#D7E2FF',
  onPrimary: '#FFFFFF',
  
  secondary: '#C59B27',            // Burnished Gold - זהב מעודן
  secondaryContainer: '#FECE57',   // זהב זוהר
  secondaryFixed: '#FFDF98',
  secondaryFixedDim: '#EEC14B',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#735700',
  
  tertiary: '#2A4365',             // Deep Sapphire
  tertiaryContainer: '#102C4D',
  tertiaryFixed: '#D4E3FF',
  
  // Backgrounds & Surfaces
  background: '#FBF9F5',           // Warm Parchment - גוון קלף
  surface: '#FDFBF7',              // Surface ראשי
  surfaceCard: '#FFFFFF',          // כרטיס לבן בוהק עם מסגרת
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F5F3EF',
  surfaceContainer: '#EFEEEA',
  surfaceContainerHigh: '#EAE8E4',
  surfaceContainerHighest: '#E4E2DE',
  surfaceDim: '#DBDDA6',
  
  // Text & Borders
  onSurface: '#1B1C1A',            // טקסט ראשי קריא
  onSurfaceVariant: '#64748B',     // טקסט משני אפור/סלייט
  outline: '#75777E',
  outlineVariant: '#C5C6CE',
  border: '#E8E3D7',               // קווי הפרדה עדינים בגוון קלף
  
  // Status Colors
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  success: '#15803D',
  successContainer: '#DCFCE7',
};

export const Shadows = {
  card: {
    shadowColor: '#1B2B48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardElevated: {
    shadowColor: '#1B2B48',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  goldGlow: {
    shadowColor: '#C59B27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  }
};
