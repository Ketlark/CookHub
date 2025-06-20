import { View, ScrollView, Pressable, Linking, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

/**
 * About Screen Component
 * 
 * Displays comprehensive information about the CookHub app including:
 * - App mission and story
 * - Key features and capabilities
 * - Team member profiles
 * - Company information and social links
 * - Version history and acknowledgments
 * 
 * @returns JSX.Element - The about screen
 */
export default function About() {
  const router = useRouter();
  
  const teamMembers: TeamMember[] = [
    {
      id: 'sarah_chen',
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: 'Former chef turned tech entrepreneur with a passion for making cooking accessible to everyone.'
    },
    {
      id: 'marcus_rodriguez',
      name: 'Marcus Rodriguez',
      role: 'Head of Product',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Product designer with 8+ years experience creating delightful user experiences for food apps.'
    },
    {
      id: 'emily_watson',
      name: 'Emily Watson',
      role: 'Lead Developer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      bio: 'Full-stack developer who loves building scalable solutions for the culinary community.'
    },
    {
      id: 'david_kim',
      name: 'David Kim',
      role: 'Culinary Director',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Professional chef and cookbook author ensuring all recipes meet the highest culinary standards.'
    }
  ];

  const keyFeatures: Feature[] = [
    {
      id: 'recipe_discovery',
      title: 'Smart Recipe Discovery',
      description: 'AI-powered recommendations based on your taste preferences and dietary needs',
      icon: 'auto-awesome',
      color: '#f59e0b'
    },
    {
      id: 'meal_planning',
      title: 'Intelligent Meal Planning',
      description: 'Plan your week with automated grocery lists and nutritional insights',
      icon: 'event-note',
      color: '#10b981'
    },
    {
      id: 'cooking_timers',
      title: 'Multi-Step Cooking Timers',
      description: 'Never overcook again with smart timers for every cooking step',
      icon: 'timer',
      color: '#ef4444'
    },
    {
      id: 'social_cooking',
      title: 'Social Cooking Community',
      description: 'Share recipes, get feedback, and learn from fellow cooking enthusiasts',
      icon: 'people',
      color: '#8b5cf6'
    },
    {
      id: 'offline_access',
      title: 'Offline Recipe Access',
      description: 'Cook anywhere with offline access to your saved recipes and collections',
      icon: 'cloud-download',
      color: '#06b6d4'
    },
    {
      id: 'nutrition_tracking',
      title: 'Nutrition Tracking',
      description: 'Track calories, macros, and nutritional information for every meal',
      icon: 'local-dining',
      color: '#f97316'
    }
  ];

  /**
   * Handle opening external links
   * @param url - The URL to open
   */
  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Failed to open link:', error);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      {/* Header */}
      <View className="px-6 py-4 border-b border-orange-100 bg-white shadow-sm">
        <View className="flex-row items-center">
          <Pressable 
            onPress={() => router.back()} 
            className="bg-orange-100 p-2 rounded-xl mr-4" 
            hitSlop={8}
          >
            <MaterialIcons name="arrow-back" size={24} color="#ca3500" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">About CookHub</Text>
            <Text className="text-sm text-gray-600">Discover our story and mission</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        {/* App Logo and Mission */}
        <Animated.View entering={FadeInDown.duration(300)} className="items-center mb-8">
          <View className="bg-orange-500 w-24 h-24 rounded-3xl items-center justify-center mb-6 shadow-lg">
            <MaterialIcons name="restaurant" size={48} color="white" />
          </View>
          
          <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">
            CookHub
          </Text>
          
          <Text className="text-lg text-gray-600 text-center leading-7 px-4">
            Empowering home cooks worldwide to create delicious meals with confidence, 
            creativity, and community support.
          </Text>
        </Animated.View>

        {/* Our Story */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} className="mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">Our Story</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <Text className="text-base text-gray-700 leading-7 mb-4">
              CookHub was born from a simple idea: cooking should be joyful, not stressful. 
              Founded in 2022 by a team of passionate food lovers and tech innovators, 
              we set out to create the ultimate cooking companion.
            </Text>
            
            <Text className="text-base text-gray-700 leading-7 mb-4">
              What started as a weekend project has grown into a thriving community of 
              over 500,000 home cooks who share recipes, tips, and culinary adventures 
              from around the world.
            </Text>
            
            <Text className="text-base text-gray-700 leading-7">
              Today, CookHub continues to evolve, powered by user feedback and our 
              commitment to making cooking accessible, enjoyable, and social for everyone.
            </Text>
          </View>
        </Animated.View>

        {/* Key Features */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} className="mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">What Makes Us Special</Text>
          
          <View className="space-y-4">
            {keyFeatures.map((feature, index) => (
              <Animated.View 
                key={feature.id}
                entering={FadeInDown.duration(300).delay(index * 50 + 250)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100"
              >
                <View className="flex-row items-start">
                  <View 
                    className="p-3 rounded-xl mr-4 mt-1"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <MaterialIcons name={feature.icon} size={24} color={feature.color} />
                  </View>
                  
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </Text>
                    <Text className="text-base text-gray-600 leading-6">
                      {feature.description}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Meet the Team */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} className="mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">Meet the Team</Text>
          
          <View className="space-y-4">
            {teamMembers.map((member, index) => (
              <Animated.View 
                key={member.id}
                entering={FadeInDown.duration(300).delay(index * 100 + 350)}
                className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100"
              >
                <View className="flex-row items-start">
                  <Image
                    source={{ uri: member.avatar }}
                    className="w-16 h-16 rounded-full mr-4"
                    resizeMode="cover"
                  />
                  
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900 mb-1">
                      {member.name}
                    </Text>
                    <Text className="text-base font-medium text-orange-600 mb-3">
                      {member.role}
                    </Text>
                    <Text className="text-sm text-gray-600 leading-5">
                      {member.bio}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Statistics */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)} className="mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">By the Numbers</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <View className="grid grid-cols-2 gap-6">
              <View className="items-center">
                <Text className="text-3xl font-bold text-orange-500 mb-2">500K+</Text>
                <Text className="text-sm font-medium text-gray-600 text-center">Active Cooks</Text>
              </View>
              
              <View className="items-center">
                <Text className="text-3xl font-bold text-orange-500 mb-2">50K+</Text>
                <Text className="text-sm font-medium text-gray-600 text-center">Shared Recipes</Text>
              </View>
              
              <View className="items-center">
                <Text className="text-3xl font-bold text-orange-500 mb-2">2M+</Text>
                <Text className="text-sm font-medium text-gray-600 text-center">Meals Cooked</Text>
              </View>
              
              <View className="items-center">
                <Text className="text-3xl font-bold text-orange-500 mb-2">150+</Text>
                <Text className="text-sm font-medium text-gray-600 text-center">Countries</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Social Links */}
        <Animated.View entering={FadeInDown.duration(400).delay(500)} className="mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">Connect With Us</Text>
          
          <View className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <Pressable 
              onPress={() => handleOpenLink('https://instagram.com/cookhub')}
              className="flex-row items-center p-4 active:bg-gray-50"
            >
              <View className="bg-pink-100 p-3 rounded-xl mr-4">
                <MaterialIcons name="camera-alt" size={24} color="#ec4899" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">Instagram</Text>
                <Text className="text-sm text-gray-600">@cookhub - Daily recipe inspiration</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </Pressable>
            
            <View className="h-px bg-gray-100 ml-20" />
            
            <Pressable 
              onPress={() => handleOpenLink('https://twitter.com/cookhub')}
              className="flex-row items-center p-4 active:bg-gray-50"
            >
              <View className="bg-blue-100 p-3 rounded-xl mr-4">
                <MaterialIcons name="alternate-email" size={24} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">Twitter</Text>
                <Text className="text-sm text-gray-600">@cookhub - Latest updates and tips</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </Pressable>
            
            <View className="h-px bg-gray-100 ml-20" />
            
            <Pressable 
              onPress={() => handleOpenLink('https://youtube.com/@cookhub')}
              className="flex-row items-center p-4 active:bg-gray-50"
            >
              <View className="bg-red-100 p-3 rounded-xl mr-4">
                <MaterialIcons name="play-circle-filled" size={24} color="#ef4444" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">YouTube</Text>
                <Text className="text-sm text-gray-600">Cooking tutorials and chef interviews</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </Pressable>
            
            <View className="h-px bg-gray-100 ml-20" />
            
            <Pressable 
              onPress={() => handleOpenLink('https://cookhub.app/blog')}
              className="flex-row items-center p-4 active:bg-gray-50"
            >
              <View className="bg-green-100 p-3 rounded-xl mr-4">
                <MaterialIcons name="article" size={24} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">Blog</Text>
                <Text className="text-sm text-gray-600">Cooking guides and food stories</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </Pressable>
          </View>
        </Animated.View>

        {/* App Information */}
        <Animated.View entering={FadeInDown.duration(400).delay(600)} className="mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">App Information</Text>
          
          <View className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <View className="p-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-base font-semibold text-gray-900">Version</Text>
                <Text className="text-base text-gray-600">2.1.0</Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-base font-semibold text-gray-900">Release Date</Text>
                <Text className="text-base text-gray-600">January 15, 2024</Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-base font-semibold text-gray-900">Compatibility</Text>
                <Text className="text-base text-gray-600">iOS 14.0+</Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-semibold text-gray-900">Languages</Text>
                <Text className="text-base text-gray-600">12 Languages</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Acknowledgments */}
        <Animated.View entering={FadeInDown.duration(400).delay(700)} className="mb-8">
          <View className="bg-orange-100 rounded-2xl p-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">Special Thanks</Text>
            
            <Text className="text-base text-gray-700 leading-6 mb-4">
              CookHub wouldn't be possible without our amazing community of home cooks, 
              professional chefs, and food enthusiasts who share their knowledge and passion.
            </Text>
            
            <Text className="text-base text-gray-700 leading-6">
              We're also grateful to our open-source contributors, beta testers, and 
              everyone who provides feedback to help us improve the app every day.
            </Text>
          </View>
        </Animated.View>

        {/* Copyright */}
        <Animated.View entering={FadeInDown.duration(400).delay(800)} className="items-center mb-8">
          <Text className="text-sm text-gray-500 text-center">
            © 2024 CookHub Inc. All rights reserved.
          </Text>
          <Text className="text-sm text-gray-500 text-center mt-1">
            Made with ❤️ for food lovers everywhere
          </Text>
        </Animated.View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}