import { View, ScrollView, Pressable, Linking, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import * as MailComposer from "expo-mail-composer";
import Animated, { FadeInDown } from "react-native-reanimated";

interface HelpSection {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  action: () => void;
  color: string;
  bgColor: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'recipes' | 'account' | 'features' | 'technical';
}

/**
 * Help & Support Screen Component
 * 
 * Comprehensive support center including:
 * - Quick help actions (contact, FAQ, tutorials)
 * - Frequently asked questions with search
 * - Contact options (email, chat, community)
 * - App information and version details
 * 
 * @returns JSX.Element - The help and support screen
 */
export default function HelpSupport() {
  const router = useRouter();
  
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqs: FAQ[] = [
    // Recipes Category
    {
      id: 'recipe_save',
      question: 'How do I save recipes to my collection?',
      answer: 'Tap the heart icon on any recipe to save it to your favorites. You can also create custom collections by tapping the bookmark icon and selecting "Add to Collection".',
      category: 'recipes'
    },
    {
      id: 'recipe_share',
      question: 'Can I share my own recipes with others?',
      answer: 'Yes! Tap the "+" button on the home screen and select "Create Recipe". Fill in the details, add photos, and publish it to share with the CookHub community.',
      category: 'recipes'
    },
    {
      id: 'recipe_offline',
      question: 'Can I access recipes offline?',
      answer: 'Saved recipes are automatically downloaded for offline access. You can view ingredients, instructions, and photos even without an internet connection.',
      category: 'recipes'
    },
    
    // Account Category
    {
      id: 'account_sync',
      question: 'How do I sync my data across devices?',
      answer: 'Your recipes, collections, and preferences are automatically synced when you sign in with the same account on multiple devices. Make sure you\'re logged in to enable sync.',
      category: 'account'
    },
    {
      id: 'account_delete',
      question: 'How do I delete my account?',
      answer: 'Go to Profile > Privacy & Security > Account Management > Delete Account. Note that this action is permanent and cannot be undone.',
      category: 'account'
    },
    
    // Features Category
    {
      id: 'timer_multiple',
      question: 'Can I set multiple cooking timers?',
      answer: 'Yes! You can set up to 5 simultaneous timers. Each timer can be labeled (e.g., "Pasta", "Sauce") and will send notifications when time is up.',
      category: 'features'
    },
    {
      id: 'meal_planning',
      question: 'How does meal planning work?',
      answer: 'Use the Calendar tab to plan meals for the week. Drag recipes onto specific days, and the app will automatically generate shopping lists based on your meal plan.',
      category: 'features'
    },
    
    // Technical Category
    {
      id: 'app_slow',
      question: 'The app is running slowly. What can I do?',
      answer: 'Try closing and reopening the app. If the issue persists, restart your device or check for app updates in the App Store. Clear the app cache in Settings if needed.',
      category: 'technical'
    },
    {
      id: 'photos_not_loading',
      question: 'Recipe photos are not loading properly',
      answer: 'This is usually due to a slow internet connection. Try switching between WiFi and mobile data, or wait for a better connection. Photos are cached once loaded.',
      category: 'technical'
    }
  ];

  /**
   * Handle email support contact
   */
  const handleEmailSupport = async () => {
    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      
      if (isAvailable) {
        await MailComposer.composeAsync({
          recipients: ['support@cookhub.app'],
          subject: 'CookHub Support Request',
          body: 'Hi CookHub Support Team,\n\nI need help with:\n\n[Please describe your issue here]\n\nDevice: iOS\nApp Version: 2.1.0\n\nThank you!'
        });
      } else {
        Alert.alert(
          "Email Not Available",
          "Please send an email to support@cookhub.app or use the in-app chat feature."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open email composer. Please try again.");
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  /**
   * Handle opening external links
   * @param url - The URL to open
   */
  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to open this link.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open link. Please try again.");
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  /**
   * Handle live chat (simulated)
   */
  const handleLiveChat = () => {
    Alert.alert(
      "Live Chat",
      "Our support team is available Monday-Friday, 9 AM - 6 PM PST. Average response time is under 2 hours.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Start Chat", onPress: () => {
          // In a real app, this would open a chat interface
          Alert.alert("Chat Started", "You've been connected to our support team!");
        }}
      ]
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  /**
   * Handle FAQ expansion
   * @param faqId - The FAQ ID to expand/collapse
   */
  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  /**
   * Filter FAQs based on search query
   */
  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const helpSections: HelpSection[] = [
    {
      id: 'email_support',
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: 'email',
      action: handleEmailSupport,
      color: '#2563eb',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'live_chat',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: 'chat',
      action: handleLiveChat,
      color: '#16a34a',
      bgColor: 'bg-green-100'
    },
    {
      id: 'video_tutorials',
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides and tips',
      icon: 'play-circle-filled',
      action: () => handleOpenLink('https://youtube.com/@cookhub'),
      color: '#dc2626',
      bgColor: 'bg-red-100'
    },
    {
      id: 'community',
      title: 'Community Forum',
      description: 'Connect with other cooking enthusiasts',
      icon: 'forum',
      action: () => handleOpenLink('https://community.cookhub.app'),
      color: '#7c3aed',
      bgColor: 'bg-purple-100'
    }
  ];

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
            <Text className="text-xl font-bold text-gray-800">Help & Support</Text>
            <Text className="text-sm text-gray-600">We're here to help you cook better</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        {/* Quick Help Actions */}
        <Animated.View entering={FadeInDown.duration(300)} className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">Get Help</Text>
          
          <View className="grid grid-cols-2 gap-4">
            {helpSections.map((section, index) => (
              <Animated.View 
                key={section.id}
                entering={FadeInDown.duration(400).delay(index * 100)}
                className="flex-1"
              >
                <Pressable 
                  onPress={section.action}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 active:scale-95"
                  style={{ minHeight: 120 }}
                >
                  <View className={`${section.bgColor} p-3 rounded-xl self-start mb-3`}>
                    <MaterialIcons name={section.icon} size={24} color={section.color} />
                  </View>
                  <Text className="text-base font-semibold text-gray-900 mb-2">
                    {section.title}
                  </Text>
                  <Text className="text-sm text-gray-600 leading-5">
                    {section.description}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* FAQ Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</Text>
          
          {/* Search Bar */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-orange-100">
            <View className="flex-row items-center">
              <MaterialIcons name="search" size={20} color="#9ca3af" />
              <Text 
                className="flex-1 ml-3 text-base text-gray-900"
                onChangeText={setSearchQuery}
                placeholder="Search FAQs..."
              />
            </View>
          </View>
          
          {/* FAQ List */}
          <View className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            {filteredFAQs.map((faq, index) => (
              <View key={faq.id}>
                <Pressable 
                  onPress={() => toggleFAQ(faq.id)}
                  className="p-4 active:bg-gray-50"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 text-base font-semibold text-gray-900 mr-4">
                      {faq.question}
                    </Text>
                    <MaterialIcons 
                      name={expandedFAQ === faq.id ? 'expand-less' : 'expand-more'} 
                      size={24} 
                      color="#9ca3af" 
                    />
                  </View>
                  
                  {expandedFAQ === faq.id && (
                    <Animated.View entering={FadeInDown.duration(200)} className="mt-3">
                      <Text className="text-sm text-gray-600 leading-6">
                        {faq.answer}
                      </Text>
                    </Animated.View>
                  )}
                </Pressable>
                
                {index < filteredFAQs.length - 1 && (
                  <View className="h-px bg-gray-100 ml-4" />
                )}
              </View>
            ))}
          </View>
          
          {filteredFAQs.length === 0 && searchQuery && (
            <View className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100 items-center">
              <MaterialIcons name="search-off" size={48} color="#9ca3af" />
              <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                No results found
              </Text>
              <Text className="text-sm text-gray-600 text-center">
                Try different keywords or contact our support team for help
              </Text>
            </View>
          )}
        </Animated.View>

        {/* App Information */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">App Information</Text>
          
          <View className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <View className="p-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-base font-semibold text-gray-900">Version</Text>
                <Text className="text-base text-gray-600">2.1.0 (Build 2024.1)</Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-base font-semibold text-gray-900">Last Updated</Text>
                <Text className="text-base text-gray-600">January 15, 2024</Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-semibold text-gray-900">Size</Text>
                <Text className="text-base text-gray-600">45.2 MB</Text>
              </View>
            </View>
            
            <View className="h-px bg-gray-100" />
            
            <Pressable 
              onPress={() => handleOpenLink('https://cookhub.app/privacy')}
              className="flex-row items-center justify-between p-4 active:bg-gray-50"
            >
              <Text className="text-base font-semibold text-gray-900">Privacy Policy</Text>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </Pressable>
            
            <View className="h-px bg-gray-100" />
            
            <Pressable 
              onPress={() => handleOpenLink('https://cookhub.app/terms')}
              className="flex-row items-center justify-between p-4 active:bg-gray-50"
            >
              <Text className="text-base font-semibold text-gray-900">Terms of Service</Text>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </Pressable>
            
            <View className="h-px bg-gray-100" />
            
            <Pressable 
              onPress={() => handleOpenLink('https://cookhub.app/licenses')}
              className="flex-row items-center justify-between p-4 active:bg-gray-50"
            >
              <Text className="text-base font-semibold text-gray-900">Open Source Licenses</Text>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </Pressable>
          </View>
        </Animated.View>

        {/* Contact Information */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)} className="mb-8">
          <View className="bg-orange-100 rounded-2xl p-6">
            <View className="flex-row items-center mb-4">
              <View className="bg-orange-500 p-3 rounded-xl mr-4">
                <MaterialIcons name="support-agent" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">Still need help?</Text>
                <Text className="text-sm text-gray-600">Our support team is here for you</Text>
              </View>
            </View>
            
            <Text className="text-sm text-gray-700 mb-4">
              Can't find what you're looking for? Our friendly support team is available to help you with any questions or issues.
            </Text>
            
            <Pressable 
              onPress={handleEmailSupport}
              className="bg-orange-500 rounded-xl p-4 items-center"
            >
              <Text className="text-white font-semibold text-base">Contact Support</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}