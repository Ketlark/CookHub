import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

interface QuickAction {
  id: string;
  title: string;
  query: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface QuickActionsProps {
  onActionPress: (query: string) => void;
  visible: boolean;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: '1',
    title: 'Find Recipes',
    query: 'Find me some delicious recipes I can make today',
    icon: 'search-outline',
    color: '#f97316'
  },
  {
    id: '2',
    title: 'Cooking Tips',
    query: 'Give me some helpful cooking tips and techniques',
    icon: 'bulb-outline',
    color: '#eab308'
  },
  {
    id: '3',
    title: 'Substitutes',
    query: 'Help me with ingredient substitutions',
    icon: 'swap-horizontal-outline',
    color: '#06b6d4'
  },
  {
    id: '4',
    title: 'Help Cooking',
    query: 'Guide me through cooking step by step',
    icon: 'help-circle-outline',
    color: '#8b5cf6'
  },
  {
    id: '5',
    title: 'Quick Meals',
    query: 'Show me quick and easy meal ideas',
    icon: 'flash-outline',
    color: '#f59e0b'
  },
  {
    id: '6',
    title: 'Healthy Options',
    query: 'Suggest healthy and nutritious recipes',
    icon: 'leaf-outline',
    color: '#10b981'
  }
];

/**
 * QuickActions component displaying predefined query buttons
 * Shows horizontally scrollable action buttons for common cooking queries
 */
export const QuickActions: React.FC<QuickActionsProps> = ({ onActionPress, visible }) => {
  const handleActionPress = (action: QuickAction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onActionPress(action.query);
  };

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(300).springify()}
      layout={Layout.springify()}
      className="mb-4"
    >
      <View className="px-4">
        <Text className="text-gray-600 text-sm font-medium mb-3">
          Quick actions to get started:
        </Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="flex-row"
      >
        {QUICK_ACTIONS.map((action, index) => (
          <Animated.View
            key={action.id}
            entering={FadeInDown.delay(400 + index * 100).springify()}
            className="mr-3"
          >
            <TouchableOpacity
              onPress={() => handleActionPress(action)}
              activeOpacity={0.8}
              className="bg-white rounded-2xl p-4 min-w-[120px] items-center"
              style={{
                shadowColor: action.color,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              {/* Icon Container */}
              <View 
                className="rounded-full p-3 mb-3"
                style={{ backgroundColor: `${action.color}15` }}
              >
                <Ionicons 
                  name={action.icon} 
                  size={24} 
                  color={action.color}
                />
              </View>
              
              {/* Title */}
              <Text className="text-gray-900 font-semibold text-center text-sm leading-tight">
                {action.title}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
      
      {/* Helper Text */}
      <View className="px-4 mt-4">
        <View className="bg-orange-50 border border-orange-200 rounded-xl p-3">
          <View className="flex-row items-center">
            <Ionicons name="information-circle-outline" size={16} color="#f97316" />
            <Text className="text-orange-700 text-xs font-medium ml-2">
              Tip: You can also type your own questions!
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};