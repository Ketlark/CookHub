import { View, ScrollView, Pressable, TextInput, Alert, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import Animated, { FadeInDown } from "react-native-reanimated";

/**
 * Edit Profile Screen Component
 * 
 * Allows users to update their personal information including:
 * - Profile picture
 * - Name and email
 * - Location and bio
 * - Contact preferences
 * 
 * @returns JSX.Element - The edit profile screen
 */
export default function EditProfile() {
  const router = useRouter();
  
  // User profile state
  const [profileData, setProfileData] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    location: "San Francisco, CA",
    bio: "Passionate home cook who loves experimenting with flavors from around the world. Always looking for new recipes to try!",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    phone: "+1 (555) 123-4567",
    website: "www.sarahcooks.com"
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  /**
   * Handle input field changes
   * @param field - The field name to update
   * @param value - The new value
   */
  const handleInputChange = (field: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  /**
   * Handle profile picture selection
   */
  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to update your profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleInputChange('avatar', result.assets[0].uri);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  /**
   * Handle save profile changes
   */
  const handleSaveProfile = async () => {
    if (!hasChanges) {
      router.back();
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        "Success",
        "Your profile has been updated successfully!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
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

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      {/* Header */}
      <View className="px-6 py-4 border-b border-orange-100 bg-white shadow-sm">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={handleBack} className="bg-orange-100 p-2 rounded-xl" hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color="#ca3500" />
          </Pressable>
          <View className="flex-1 mx-4">
            <Text className="text-xl font-bold text-gray-800 text-center">Edit Profile</Text>
          </View>
          <Pressable 
            onPress={handleSaveProfile}
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

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <Animated.View entering={FadeInDown.duration(300)} className="items-center py-8">
          <View className="relative">
            <Image
              source={{ uri: profileData.avatar }}
              className="w-32 h-32 rounded-full"
              resizeMode="cover"
            />
            <Pressable 
              onPress={handleImagePicker}
              className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-3 shadow-lg"
            >
              <MaterialIcons name="camera-alt" size={20} color="white" />
            </Pressable>
          </View>
          <Text className="text-gray-600 text-sm mt-3">Tap to change profile picture</Text>
        </Animated.View>

        {/* Form Fields */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} className="space-y-6">
          {/* Name Field */}
          <View>
            <Text className="text-lg font-semibold text-gray-900 mb-3">Full Name *</Text>
            <TextInput
              className="bg-white rounded-xl p-4 text-base text-gray-900 border border-orange-200 shadow-sm"
              placeholder="Enter your full name"
              value={profileData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              maxLength={50}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Email Field */}
          <View>
            <Text className="text-lg font-semibold text-gray-900 mb-3">Email Address *</Text>
            <TextInput
              className="bg-white rounded-xl p-4 text-base text-gray-900 border border-orange-200 shadow-sm"
              placeholder="Enter your email"
              value={profileData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Phone Field */}
          <View>
            <Text className="text-lg font-semibold text-gray-900 mb-3">Phone Number</Text>
            <TextInput
              className="bg-white rounded-xl p-4 text-base text-gray-900 border border-orange-200 shadow-sm"
              placeholder="Enter your phone number"
              value={profileData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Location Field */}
          <View>
            <Text className="text-lg font-semibold text-gray-900 mb-3">Location</Text>
            <TextInput
              className="bg-white rounded-xl p-4 text-base text-gray-900 border border-orange-200 shadow-sm"
              placeholder="Enter your location"
              value={profileData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              maxLength={100}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Website Field */}
          <View>
            <Text className="text-lg font-semibold text-gray-900 mb-3">Website</Text>
            <TextInput
              className="bg-white rounded-xl p-4 text-base text-gray-900 border border-orange-200 shadow-sm"
              placeholder="Enter your website URL"
              value={profileData.website}
              onChangeText={(value) => handleInputChange('website', value)}
              keyboardType="url"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Bio Field */}
          <View>
            <Text className="text-lg font-semibold text-gray-900 mb-3">Bio</Text>
            <TextInput
              className="bg-white rounded-xl p-4 text-base text-gray-900 border border-orange-200 shadow-sm h-32"
              placeholder="Tell us about yourself and your cooking journey..."
              value={profileData.bio}
              onChangeText={(value) => handleInputChange('bio', value)}
              multiline
              textAlignVertical="top"
              maxLength={300}
              placeholderTextColor="#9CA3AF"
            />
            <Text className="text-xs text-gray-500 mt-2">
              {profileData.bio.length}/300 characters
            </Text>
          </View>
        </Animated.View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}