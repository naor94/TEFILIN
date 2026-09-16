import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bell, BookOpen, Calendar, History } from 'lucide-react-native';
import { Colors } from '../theme/colors';

export type TabKey = 'today' | 'order' | 'reminders' | 'history';

interface BottomNavBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: 'today', label: 'היום', icon: Calendar },
    { key: 'order', label: 'סדר הנחה', icon: BookOpen },
    { key: 'reminders', label: 'תזכורות', icon: Bell },
    { key: 'history', label: 'היסטוריה', icon: History },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const IconComponent = tab.icon;

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={0.8}
              style={[styles.tabItem, isActive && styles.activeTabItem]}
            >
              <IconComponent
                size={22}
                color={isActive ? Colors.secondary : Colors.onSurfaceVariant}
                strokeWidth={isActive ? 2.4 : 1.8}
              />
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceCard,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    paddingBottom: 24, // Safe Area padding
    paddingTop: 8,
    shadowColor: '#1B2B48',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  navBar: {
    flexDirection: 'row-reverse', // RTL Support
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: 540,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 12,
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
    minWidth: 68,
  },
  activeTabItem: {
    backgroundColor: 'rgba(254, 206, 87, 0.22)', // Soft gold accent fill from Stitch
  },
  tabLabel: {
    fontFamily: 'NotoSans_500Medium',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 3,
  },
  activeTabLabel: {
    fontFamily: 'NotoSans_700Bold',
    color: Colors.secondary,
  },
});
