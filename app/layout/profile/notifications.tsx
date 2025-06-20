import { View, ScrollView, Pressable, Switch, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  category: 'cooking' | 'social' | 'system';
}

/**
 * Notifications Settings Screen Component
 * 
 * Allows users to manage their notification preferences including:
 * - Recipe reminders and cooking timers
 * - Social interactions (likes, comments, follows)
 * - System notifications (updates, security)
 * - Push notification scheduling
 * 
 * @returns JSX.Element - The notifications settings screen
 */
export default function NotificationSettings() {
  const router = useRouter();
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    // Cooking Notifications
    {
      id: 'recipe_reminders',
      title: 'Recipe Reminders',
      description: 'Get reminded about saved recipes you want to try',
      enabled: true,
      icon: 'schedule',
      category: 'cooking'
    },
    {
      id: 'cooking_timers',
      title: 'Cooking Timers',
      description: 'Notifications for active cooking timers and alerts',
      enabled: true,
      icon: 'timer',
      category: 'cooking'
    },
    {
      id: 'meal_planning',
      title: 'Meal Planning',
      description: 'Weekly meal plan reminders and grocery lists',
      enabled: false,
      icon: 'event-note',
      category: 'cooking'
    },
    {
      id: 'seasonal_recipes',
      title: 'Seasonal Recipes',
      description: 'Discover recipes perfect for the current season',
      enabled: true,
      icon: 'eco',
      category: 'cooking'
    },
    
    // Social Notifications
    {
      id: 'recipe_likes',
      title: 'Recipe Likes',
      description: 'When someone likes your shared recipes',
      enabled: true,
      icon: 'favorite',
      category: 'social'
    },
    {
      id: 'recipe_comments',
      title: 'Recipe Comments',
      description: 'New comments on your recipes and discussions',
      enabled: true,
      icon: 'comment',
      category: 'social'
    },
    {
      id: 'new_followers',
      title: 'New Followers',
      description: 'When someone starts following your cooking journey',
      enabled: false,
      icon: 'person-add',
      category: 'social'
    },
    {
      id: 'friend_activity',
      title: 'Friend Activity',
      description: 'Updates from people you follow',
      enabled: true,
      icon: 'people',
      category: 'social'
    },
    
    // System Notifications
    {
      id: 'app_updates',
      title: 'App Updates',
      description: 'New features and app improvements',
      enabled: true,
      icon: 'system-update',
      category: 'system'
    },
    {
      id: 'security_alerts',
      title: 'Security Alerts',
      description: 'Important security and account notifications',
      enabled: true,
      icon: 'security',
      category: 'system'
    },
    {
      id: 'promotional',
      title: 'Promotional Content',
      description: 'Special offers and featured content',
      enabled: false,
      icon: 'local-offer',
      category: 'system'
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  /**
   * Toggle notification setting
   * @param settingId - The ID of the setting to toggle
   */
  const toggleNotification = (settingId: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
    setHasChanges(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  /**
   * Save notification preferences
   */
  const saveNotificationSettings = async () => {
    if (!hasChanges) {
      router.back();
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        "Settings Saved",
        "Your notification preferences have been updated successfully!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle back navigation with unsaved changes check
   */
  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Discard", style: "destructive", onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  /**
   * Get category color scheme
   * @param category - The notification category
   */
  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'cooking':
        return { bg: 'bg-orange-100', icon: '#ea580c' };
      case 'social':
        return { bg: 'bg-blue-100', icon: '#2563eb' };
      case 'system':
        return { bg: 'bg-gray-100', icon: '#4b5563' };
      default:
        return { bg: 'bg-gray-100', icon: '#6b7280' };
    }
  };

  /**
   * Group notifications by category
   */
  const groupedNotifications = notificationSettings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, NotificationSetting[]>);

  const categoryTitles = {
    cooking: 'Cooking & Recipes',
    social: 'Social Interactions',
    system: 'System & Security'
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      {/* Header */}
      <View className="px-6 py-4 border-b border-orange-100 bg-white shadow-sm">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={handleBack} className="bg-orange-100 p-2 rounded-xl" hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color="#ca3500" />
          </Pressable>
          <View className="flex-1 mx-4">
            <Text className="text-xl font-bold text-gray-800 text-center">Notifications</Text>
          </View>
          <Pressable 
            onPress={saveNotificationSettings}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl ${
              hasChanges ? 'bg-orange-500' : 'bg-gray-300'
            }`}
          >
            <Text className={`font-semibold ${
              hasChanges ? 'text-white' : 'text-gray-500'
            }`}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.duration(300)} className="mb-8">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <Text className="text-lg font-bold text-gray-900 mb-4">Quick Actions</Text>
            <View className="flex-row space-x-4">
              <Pressable 
                onPress={() => {
                  setNotificationSettings(prev => prev.map(s => ({ ...s, enabled: true })));
                  setHasChanges(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                className="flex-1 bg-green-100 rounded-xl p-4 items-center"
              >
                <MaterialIcons name="notifications-active" size={24} color="#16a34a" />
                <Text className="text-green-700 font-semibold mt-2 text-center">Enable All</Text>
              </Pressable>
              <Pressable 
                onPress={() => {
                  setNotificationSettings(prev => prev.map(s => ({ ...s, enabled: false })));
                  setHasChanges(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                className="flex-1 bg-red-100 rounded-xl p-4 items-center"
              >
                <MaterialIcons name="notifications-off" size={24} color="#dc2626" />
                <Text className="text-red-700 font-semibold mt-2 text-center">Disable All</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* Notification Categories */}
        {Object.entries(groupedNotifications).map(([category, settings], categoryIndex) => {
          const colors = getCategoryColors(category);
          
          return (
            <Animated.View 
              key={category}
              entering={FadeInDown.duration(400).delay(categoryIndex * 100 + 200)}
              className="mb-6"
            >
              <Text className="text-lg font-bold text-gray-900 mb-4">
                {categoryTitles[category as keyof typeof categoryTitles]}
              </Text>
              
              <View className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                {settings.map((setting, index) => (
                  <View key={setting.id}>
                    <Pressable 
                      onPress={() => toggleNotification(setting.id)}
                      className="flex-row items-center p-4 active:bg-gray-50"
                    >
                      <View className={`${colors.bg} p-3 rounded-xl mr-4`}>
                        <MaterialIcons 
                          name={setting.icon} 
                          size={24} 
                          color={colors.icon} 
                        />
                      </View>
                      
                      <View className="flex-1 mr-4">
                        <Text className="text-base font-semibold text-gray-900 mb-1">
                          {setting.title}
                        </Text>
                        <Text className="text-sm text-gray-600 leading-5">
                          {setting.description}
                        </Text>
                      </View>
                      
                      <Switch
                        value={setting.enabled}
                        onValueChange={() => toggleNotification(setting.id)}
                        trackColor={{ false: '#f3f4f6', true: '#fed7aa' }}
                        thumbColor={setting.enabled ? '#ea580c' : '#9ca3af'}
                        ios_backgroundColor="#f3f4f6"
                      />
                    </Pressable>
                    
                    {index < settings.length - 1 && (
                      <View className="h-px bg-gray-100 ml-20" />
                    )}
                  </View>
                ))}
              </View>
            </Animated.View>
          );
        })}

        {/* Additional Settings */}
        <Animated.View entering={FadeInDown.duration(400).delay(500)} className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">Notification Schedule</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Do Not Disturb
                </Text>
                <Text className="text-sm text-gray-600">
                  Pause notifications during quiet hours (10 PM - 7 AM)
                </Text>
              </View>
              <Switch
                value={true}
                trackColor={{ false: '#f3f4f6', true: '#fed7aa' }}
                thumbColor="#ea580c"
                ios_backgroundColor="#f3f4f6"
              />
            </View>
            
            <View className="h-px bg-gray-100 my-4" />
            
            <Pressable className="flex-row items-center justify-between py-2">
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Notification Sound
                </Text>
                <Text className="text-sm text-gray-600">
                  Default cooking chime
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </Pressable>
          </View>
        </Animated.View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}