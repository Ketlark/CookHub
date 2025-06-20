import { View, ScrollView, Pressable, Switch, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Setting {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'navigation' | 'selection';
  value?: boolean | string;
  icon: keyof typeof MaterialIcons.glyphMap;
  category: 'general' | 'cooking' | 'display' | 'advanced';
  options?: string[];
}

/**
 * Settings Screen Component
 * 
 * Comprehensive app settings and preferences including:
 * - General app behavior settings
 * - Cooking-specific preferences
 * - Display and accessibility options
 * - Advanced configuration
 * 
 * @returns JSX.Element - The settings screen
 */
export default function Settings() {
  const router = useRouter();
  
  const [settings, setSettings] = useState<Setting[]>([
    // General Settings
    {
      id: 'auto_sync',
      title: 'Auto-Sync',
      description: 'Automatically sync recipes and data across devices',
      type: 'toggle',
      value: true,
      icon: 'sync',
      category: 'general'
    },
    {
      id: 'offline_mode',
      title: 'Offline Mode',
      description: 'Download recipes for offline access',
      type: 'toggle',
      value: true,
      icon: 'cloud-download',
      category: 'general'
    },
    {
      id: 'language',
      title: 'Language',
      description: 'App display language',
      type: 'selection',
      value: 'English',
      icon: 'language',
      category: 'general',
      options: ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Korean', 'Chinese']
    },
    {
      id: 'region',
      title: 'Region',
      description: 'Regional preferences for measurements and ingredients',
      type: 'selection',
      value: 'United States',
      icon: 'public',
      category: 'general',
      options: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Europe', 'Asia']
    },
    
    // Cooking Settings
    {
      id: 'measurement_units',
      title: 'Measurement Units',
      description: 'Default units for recipes',
      type: 'selection',
      value: 'Imperial',
      icon: 'straighten',
      category: 'cooking',
      options: ['Imperial', 'Metric', 'Both']
    },
    {
      id: 'cooking_timers',
      title: 'Smart Timers',
      description: 'Enable intelligent cooking timers and alerts',
      type: 'toggle',
      value: true,
      icon: 'timer',
      category: 'cooking'
    },
    {
      id: 'voice_commands',
      title: 'Voice Commands',
      description: 'Control timers and navigate recipes with voice',
      type: 'toggle',
      value: false,
      icon: 'mic',
      category: 'cooking'
    },
    {
      id: 'step_by_step',
      title: 'Step-by-Step Mode',
      description: 'Show one cooking step at a time',
      type: 'toggle',
      value: true,
      icon: 'list-alt',
      category: 'cooking'
    },
    {
      id: 'ingredient_substitutions',
      title: 'Smart Substitutions',
      description: 'Suggest ingredient alternatives automatically',
      type: 'toggle',
      value: true,
      icon: 'swap-horiz',
      category: 'cooking'
    },
    
    // Display Settings
    {
      id: 'theme',
      title: 'App Theme',
      description: 'Choose your preferred app appearance',
      type: 'selection',
      value: 'Auto',
      icon: 'palette',
      category: 'display',
      options: ['Light', 'Dark', 'Auto']
    },
    {
      id: 'font_size',
      title: 'Font Size',
      description: 'Adjust text size for better readability',
      type: 'selection',
      value: 'Medium',
      icon: 'text-fields',
      category: 'display',
      options: ['Small', 'Medium', 'Large', 'Extra Large']
    },
    {
      id: 'high_contrast',
      title: 'High Contrast',
      description: 'Increase contrast for better visibility',
      type: 'toggle',
      value: false,
      icon: 'contrast',
      category: 'display'
    },
    {
      id: 'reduce_animations',
      title: 'Reduce Animations',
      description: 'Minimize motion effects for accessibility',
      type: 'toggle',
      value: false,
      icon: 'motion-photos-off',
      category: 'display'
    },
    {
      id: 'screen_wake_lock',
      title: 'Keep Screen On',
      description: 'Prevent screen from sleeping while cooking',
      type: 'toggle',
      value: true,
      icon: 'screen-lock-portrait',
      category: 'display'
    },
    
    // Advanced Settings
    {
      id: 'cache_management',
      title: 'Cache Management',
      description: 'Manage app cache and storage',
      type: 'navigation',
      icon: 'storage',
      category: 'advanced'
    },
    {
      id: 'data_usage',
      title: 'Data Usage',
      description: 'Control mobile data consumption',
      type: 'navigation',
      icon: 'data-usage',
      category: 'advanced'
    },
    {
      id: 'backup_restore',
      title: 'Backup & Restore',
      description: 'Backup your recipes and settings',
      type: 'navigation',
      icon: 'backup',
      category: 'advanced'
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      description: 'Enable advanced debugging features',
      type: 'toggle',
      value: false,
      icon: 'code',
      category: 'advanced'
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  /**
   * Handle setting changes
   * @param settingId - The ID of the setting to change
   * @param newValue - The new value for the setting
   */
  const handleSettingChange = (settingId: string, newValue: boolean | string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, value: newValue }
          : setting
      )
    );
    setHasChanges(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  /**
   * Handle selection settings
   * @param settingId - The ID of the setting
   * @param options - Available options
   * @param currentValue - Current selected value
   */
  const handleSelectionSetting = (settingId: string, options: string[], currentValue: string) => {
    Alert.alert(
      "Select Option",
      "Choose your preferred setting:",
      [
        ...options.map(option => ({
          text: option,
          onPress: () => handleSettingChange(settingId, option),
          style: option === currentValue ? 'default' : 'default'
        })),
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  /**
   * Handle navigation settings
   * @param settingId - The ID of the setting
   */
  const handleNavigationSetting = (settingId: string) => {
    switch (settingId) {
      case 'cache_management':
        Alert.alert(
          "Cache Management",
          "Current cache size: 45.2 MB\n\nClear cache to free up storage space?",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Clear Cache", 
              style: "destructive",
              onPress: () => {
                Alert.alert("Success", "Cache cleared successfully!");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
            }
          ]
        );
        break;
        
      case 'data_usage':
        Alert.alert(
          "Data Usage Settings",
          "• Download recipes on WiFi only: ON\n• Auto-play videos: OFF\n• High quality images: WiFi only\n\nThis month: 125 MB used"
        );
        break;
        
      case 'backup_restore':
        Alert.alert(
          "Backup & Restore",
          "Last backup: Today, 2:30 PM\n\nYour recipes and settings are automatically backed up to iCloud.",
          [
            { text: "OK", style: "default" },
            { text: "Backup Now", onPress: () => {
              Alert.alert("Success", "Backup completed successfully!");
            }}
          ]
        );
        break;
        
      default:
        break;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  /**
   * Save settings
   */
  const saveSettings = async () => {
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
        "Your preferences have been updated successfully!",
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
   * @param category - The setting category
   */
  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'general':
        return { bg: 'bg-blue-100', icon: '#2563eb' };
      case 'cooking':
        return { bg: 'bg-orange-100', icon: '#ea580c' };
      case 'display':
        return { bg: 'bg-purple-100', icon: '#7c3aed' };
      case 'advanced':
        return { bg: 'bg-gray-100', icon: '#4b5563' };
      default:
        return { bg: 'bg-gray-100', icon: '#6b7280' };
    }
  };

  /**
   * Group settings by category
   */
  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  const categoryTitles = {
    general: 'General',
    cooking: 'Cooking Preferences',
    display: 'Display & Accessibility',
    advanced: 'Advanced'
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
            <Text className="text-xl font-bold text-gray-800 text-center">Settings</Text>
          </View>
          <Pressable 
            onPress={saveSettings}
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
                  Alert.alert(
                    "Reset to Defaults",
                    "This will reset all settings to their default values. Are you sure?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { 
                        text: "Reset", 
                        style: "destructive",
                        onPress: () => {
                          // Reset logic would go here
                          Alert.alert("Success", "Settings have been reset to defaults.");
                          setHasChanges(true);
                        }
                      }
                    ]
                  );
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                className="flex-1 bg-red-100 rounded-xl p-4 items-center"
              >
                <MaterialIcons name="restore" size={24} color="#dc2626" />
                <Text className="text-red-700 font-semibold mt-2 text-center">Reset All</Text>
              </Pressable>
              
              <Pressable 
                onPress={() => {
                  Alert.alert(
                    "Export Settings",
                    "Your settings have been exported and can be imported on other devices."
                  );
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                className="flex-1 bg-green-100 rounded-xl p-4 items-center"
              >
                <MaterialIcons name="file-download" size={24} color="#16a34a" />
                <Text className="text-green-700 font-semibold mt-2 text-center">Export</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* Settings Categories */}
        {Object.entries(groupedSettings).map(([category, categorySettings], categoryIndex) => {
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
                {categorySettings.map((setting, index) => (
                  <View key={setting.id}>
                    <Pressable 
                      onPress={() => {
                        if (setting.type === 'selection' && setting.options) {
                          handleSelectionSetting(setting.id, setting.options, setting.value as string);
                        } else if (setting.type === 'navigation') {
                          handleNavigationSetting(setting.id);
                        } else if (setting.type === 'toggle') {
                          handleSettingChange(setting.id, !setting.value);
                        }
                      }}
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
                        {setting.type === 'selection' && (
                          <Text className="text-sm font-medium text-orange-600 mt-1">
                            Current: {setting.value}
                          </Text>
                        )}
                      </View>
                      
                      {setting.type === 'toggle' && (
                        <Switch
                          value={setting.value as boolean}
                          onValueChange={(value) => handleSettingChange(setting.id, value)}
                          trackColor={{ false: '#f3f4f6', true: '#fed7aa' }}
                          thumbColor={setting.value ? '#ea580c' : '#9ca3af'}
                          ios_backgroundColor="#f3f4f6"
                        />
                      )}
                      
                      {(setting.type === 'selection' || setting.type === 'navigation') && (
                        <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
                      )}
                    </Pressable>
                    
                    {index < categorySettings.length - 1 && (
                      <View className="h-px bg-gray-100 ml-20" />
                    )}
                  </View>
                ))}
              </View>
            </Animated.View>
          );
        })}

        {/* App Information */}
        <Animated.View entering={FadeInDown.duration(400).delay(500)} className="mb-8">
          <View className="bg-orange-100 rounded-2xl p-6">
            <View className="flex-row items-center mb-4">
              <View className="bg-orange-500 p-3 rounded-xl mr-4">
                <MaterialIcons name="info" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">App Information</Text>
                <Text className="text-sm text-gray-600">Version 2.1.0 (Build 2024.1)</Text>
              </View>
            </View>
            
            <Text className="text-sm text-gray-700">
              Settings are automatically synced across your devices when signed in. 
              Some changes may require restarting the app to take effect.
            </Text>
          </View>
        </Animated.View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}