import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  I18nManager,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  useFonts,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
} from '@expo-google-fonts/rubik';
import {
  NotoSans_400Regular,
  NotoSans_500Medium,
  NotoSans_600SemiBold,
  NotoSans_700Bold,
} from '@expo-google-fonts/noto-sans';

import { Colors } from './src/theme/colors';
import { HeaderBar } from './src/components/HeaderBar';
import { BottomNavBar, TabKey } from './src/components/BottomNavBar';
import { TodayScreen } from './src/screens/TodayScreen';
import { BlessingsScreen } from './src/screens/BlessingsScreen';
import { RemindersScreen } from './src/screens/RemindersScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { NotificationService } from './src/services/notificationService';

import { RTL } from './src/theme/layout';

// הפעלת תמיכה מימין לשמאל (RTL) כברירת מחדל
try {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
} catch (e) {
  // Web fallback
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('today');

  useEffect(() => {
    NotificationService.init();
  }, []);

  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_600SemiBold,
    Rubik_700Bold,
    NotoSans_400Regular,
    NotoSans_500Medium,
    NotoSans_600SemiBold,
    NotoSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, RTL.container]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      {/* HEADER BAR */}
      <HeaderBar
        locationName="ירושלים"
        onLocationPress={() => {}}
        onCalendarPress={() => setActiveTab('history')}
      />

      {/* SCREEN CONTAINER */}
      <View style={[styles.screenContainer, RTL.container]}>
        {activeTab === 'today' && (
          <TodayScreen onNavigate={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'order' && (
          <BlessingsScreen onComplete={() => setActiveTab('today')} />
        )}
        {activeTab === 'reminders' && <RemindersScreen />}
        {activeTab === 'history' && <HistoryScreen />}
      </View>

      {/* BOTTOM NAVIGATION BAR */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    ...RTL.container,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenContainer: {
    flex: 1,
    ...RTL.container,
  },
});
