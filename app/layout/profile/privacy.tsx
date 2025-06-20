import { View, ScrollView, Pressable, Switch, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import Animated, { FadeInDown } from "react-native-reanimated";

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  category: 'profile' | 'data' | 'security';
  requiresAuth?: boolean;
}

/**
 * Privacy & Security Settings Screen Component
 * 
 * Comprehensive privacy and security management including:
 * - Profile visibility controls
 * - Data sharing preferences
 * - Security features (2FA, biometrics)
 * - Account protection settings
 * 
 * @returns JSX.Element - The privacy settings screen
 */
export default function PrivacySettings() {
  const router = useRouter();
  
  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
    // Profile Privacy
    {
      id: 'profile_public',
      title: 'Public Profile',
      description: 'Allow others to find and view your profile',
      enabled: true,
      icon: 'public',
      category: 'profile'
    },
    {
      id: 'recipe_sharing',
      title: 'Recipe Sharing',
      description: 'Others can see and share your published recipes',
      enabled: true,
      icon: 'share',
      category: 'profile'
    },
    {
      id: 'cooking_activity',
      title: 'Cooking Activity',
      description: 'Show your recent cooking activity to followers',
      enabled: false,
      icon: 'timeline',
      category: 'profile'
    },
    {
      id: 'location_sharing',
      title: 'Location in Recipes',
      description: 'Include location data when sharing recipes',
      enabled: false,
      icon: 'location-on',
      category: 'profile'
    },
    
    // Data & Analytics
    {
      id: 'usage_analytics',
      title: 'Usage Analytics',
      description: 'Help improve the app by sharing usage data',
      enabled: true,
      icon: 'analytics',
      category: 'data'
    },
    {
      id: 'personalized_ads',
      title: 'Personalized Recommendations',
      description: 'Use your data to suggest relevant recipes and content',
      enabled: true,
      icon: 'recommend',
      category: 'data'
    },
    {
      id: 'crash_reports',
      title: 'Crash Reports',
      description: 'Automatically send crash reports to help fix issues',
      enabled: true,
      icon: 'bug-report',
      category: 'data'
    },
    {
      id: 'data_export',
      title: 'Data Portability',
      description: 'Request a copy of your data at any time',
      enabled: true,
      icon: 'download',
      category: 'data'
    },
    
    // Security Features
    {
      id: 'biometric_auth',
      title: 'Biometric Authentication',
      description: 'Use fingerprint or face recognition to unlock the app',
      enabled: false,
      icon: 'fingerprint',
      category: 'security',
      requiresAuth: true
    },
    {
      id: 'two_factor_auth',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      enabled: false,
      icon: 'security',
      category: 'security',
      requiresAuth: true
    },
    {
      id: 'login_alerts',
      title: 'Login Alerts',
      description: 'Get notified when someone logs into your account',
      enabled: true,
      icon: 'notification-important',
      category: 'security'
    },
    {
      id: 'session_timeout',
      title: 'Auto-Lock',
      description: 'Automatically lock the app after 15 minutes of inactivity',
      enabled: false,
      icon: 'lock-clock',
      category: 'security'
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('fingerprint');

  /**
   * Check biometric authentication availability
   */
  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('face');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('fingerprint');
      }
      
      return compatible && enrolled;
    } catch (error) {
      return false;
    }
  };

  /**
   * Handle biometric authentication setup
   */
  const handleBiometricAuth = async () => {
    try {
      const isSupported = await checkBiometricSupport();
      
      if (!isSupported) {
        Alert.alert(
          "Biometric Authentication Unavailable",
          "Please set up fingerprint or face recognition in your device settings first."
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric login',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Password'
      });

      if (result.success) {
        togglePrivacySetting('biometric_auth');
        Alert.alert(
          "Success",
          "Biometric authentication has been enabled for your account."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to set up biometric authentication.");
    }
  };

  /**
   * Toggle privacy setting with authentication check
   * @param settingId - The ID of the setting to toggle
   */
  const togglePrivacySetting = async (settingId: string) => {
    const setting = privacySettings.find(s => s.id === settingId);
    
    if (setting?.requiresAuth && !setting.enabled) {
      if (settingId === 'biometric_auth') {
        await handleBiometricAuth();
        return;
      }
      
      if (settingId === 'two_factor_auth') {
        Alert.alert(
          "Two-Factor Authentication",
          "This will redirect you to set up 2FA with your phone number or authenticator app.",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Continue", 
              onPress: () => {
                // In a real app, this would navigate to 2FA setup
                toggleSetting(settingId);
                Alert.alert("Success", "Two-factor authentication has been enabled.");
              }
            }
          ]
        );
        return;
      }
    }
    
    toggleSetting(settingId);
  };

  /**
   * Toggle setting state
   * @param settingId - The ID of the setting to toggle
   */
  const toggleSetting = (settingId: string) => {
    setPrivacySettings(prev => 
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
   * Save privacy settings
   */
  const savePrivacySettings = async () => {
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
        "Your privacy and security settings have been updated successfully!",
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
   * @param category - The privacy category
   */
  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'profile':
        return { bg: 'bg-blue-100', icon: '#2563eb' };
      case 'data':
        return { bg: 'bg-green-100', icon: '#16a34a' };
      case 'security':
        return { bg: 'bg-red-100', icon: '#dc2626' };
      default:
        return { bg: 'bg-gray-100', icon: '#6b7280' };
    }
  };

  /**
   * Group settings by category
   */
  const groupedSettings = privacySettings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, PrivacySetting[]>);

  const categoryTitles = {
    profile: 'Profile Privacy',
    data: 'Data & Analytics',
    security: 'Security Features'
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
            <Text className="text-xl font-bold text-gray-800 text-center">Privacy & Security</Text>
          </View>
          <Pressable 
            onPress={savePrivacySettings}
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
        {/* Security Status */}
        <Animated.View entering={FadeInDown.duration(300)} className="mb-8">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-green-100 p-3 rounded-xl mr-4">
                <MaterialIcons name="verified-user" size={24} color="#16a34a" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">Security Status</Text>
                <Text className="text-sm text-green-600 font-medium">Good - Account Protected</Text>
              </View>
            </View>
            
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Password Strength</Text>
                <Text className="text-sm font-medium text-green-600">Strong</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Last Password Change</Text>
                <Text className="text-sm text-gray-900">2 months ago</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Active Sessions</Text>
                <Text className="text-sm text-gray-900">2 devices</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Privacy Categories */}
        {Object.entries(groupedSettings).map(([category, settings], categoryIndex) => {
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
                      onPress={() => togglePrivacySetting(setting.id)}
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
                        <View className="flex-row items-center">
                          <Text className="text-base font-semibold text-gray-900 mb-1">
                            {setting.title}
                          </Text>
                          {setting.requiresAuth && (
                            <MaterialIcons 
                              name="lock" 
                              size={16} 
                              color="#f59e0b" 
                              style={{ marginLeft: 8, marginBottom: 4 }}
                            />
                          )}
                        </View>
                        <Text className="text-sm text-gray-600 leading-5">
                          {setting.description}
                        </Text>
                      </View>
                      
                      <Switch
                        value={setting.enabled}
                        onValueChange={() => togglePrivacySetting(setting.id)}
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

        {/* Account Management */}
        <Animated.View entering={FadeInDown.duration(400).delay(500)} className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">Account Management</Text>
          
          <View className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <Pressable className="flex-row items-center p-4 active:bg-gray-50">
              <View className="bg-blue-100 p-3 rounded-xl mr-4">
                <MaterialIcons name="key" size={24} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Change Password
                </Text>
                <Text className="text-sm text-gray-600">
                  Update your account password
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </Pressable>
            
            <View className="h-px bg-gray-100 ml-20" />
            
            <Pressable className="flex-row items-center p-4 active:bg-gray-50">
              <View className="bg-purple-100 p-3 rounded-xl mr-4">
                <MaterialIcons name="devices" size={24} color="#7c3aed" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Manage Devices
                </Text>
                <Text className="text-sm text-gray-600">
                  View and manage logged-in devices
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </Pressable>
            
            <View className="h-px bg-gray-100 ml-20" />
            
            <Pressable className="flex-row items-center p-4 active:bg-gray-50">
              <View className="bg-red-100 p-3 rounded-xl mr-4">
                <MaterialIcons name="delete-forever" size={24} color="#dc2626" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-red-600 mb-1">
                  Delete Account
                </Text>
                <Text className="text-sm text-gray-600">
                  Permanently delete your account and data
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