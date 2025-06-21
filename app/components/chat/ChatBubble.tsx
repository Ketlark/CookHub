import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { ChatMessage } from '../../types/chat';

interface ChatBubbleProps {
  message: ChatMessage;
  onRecipePress?: (recipeId: string) => void;
}

/**
 * ChatBubble component for displaying individual chat messages
 * Supports different message types and styling for user vs AI messages
 */
export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onRecipePress }) => {
  const isUser = message.sender === 'user';
  const isError = message.type === 'error';
  
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const renderRecipeCards = () => {
    if (!message.metadata?.recipes || message.metadata.recipes.length === 0) {
      return null;
    }

    return (
      <View className="mt-3 space-y-2">
        {message.metadata.recipes.map((recipe) => (
          <TouchableOpacity
            key={recipe._id}
            className="bg-orange-50 border border-orange-200 rounded-2xl p-4"
            onPress={() => onRecipePress?.(recipe._id)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {recipe.title}
                </Text>
                <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                  {recipe.description}
                </Text>
                <View className="flex-row items-center space-x-4">
                  {recipe.cookTime && (
                    <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={14} color="#6b7280" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {recipe.cookTime}min
                      </Text>
                    </View>
                  )}
                  {recipe.servings && (
                    <View className="flex-row items-center">
                      <Ionicons name="people-outline" size={14} color="#6b7280" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {recipe.servings} servings
                      </Text>
                    </View>
                  )}
                  {recipe.difficulty && (
                    <View className="flex-row items-center">
                      <Ionicons 
                        name={recipe.difficulty === 'easy' ? 'star' : recipe.difficulty === 'medium' ? 'star-half' : 'star-outline'} 
                        size={14} 
                        color="#f97316" 
                      />
                      <Text className="text-orange-600 text-xs ml-1 capitalize">
                        {recipe.difficulty}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#f97316" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderFollowUpQuestions = () => {
    if (!message.metadata?.followUpQuestions || message.metadata.followUpQuestions.length === 0) {
      return null;
    }

    return (
      <View className="mt-3 space-y-2">
        <Text className="text-gray-500 text-sm font-medium mb-2">Suggested questions:</Text>
        {message.metadata.followUpQuestions.map((question, index) => (
          <TouchableOpacity
            key={index}
            className="bg-gray-100 rounded-xl px-3 py-2 self-start"
            activeOpacity={0.7}
          >
            <Text className="text-gray-700 text-sm">{question}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(100).springify()}
      layout={Layout.springify()}
      className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <View
        className={`
          max-w-[85%] rounded-2xl px-4 py-3
          ${isUser 
            ? 'bg-orange-500 rounded-br-md' 
            : isError 
              ? 'bg-red-100 border border-red-200 rounded-bl-md'
              : 'bg-white border border-gray-200 rounded-bl-md'
          }
        `}
        style={{
          shadowColor: isUser ? '#f97316' : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isUser ? 0.2 : 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {/* Message Content */}
        <Text
          className={`
            text-base leading-relaxed
            ${isUser 
              ? 'text-white' 
              : isError 
                ? 'text-red-700'
                : 'text-gray-900'
            }
          `}
        >
          {message.content}
        </Text>

        {/* Recipe Cards */}
        {!isUser && renderRecipeCards()}

        {/* Follow-up Questions */}
        {!isUser && renderFollowUpQuestions()}

        {/* Timestamp */}
        <Text
          className={`
            text-xs mt-2 opacity-70
            ${isUser ? 'text-white text-right' : 'text-gray-500'}
          `}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>

      {/* Sender Avatar/Indicator */}
      {!isUser && (
        <View className="flex-row items-center mt-1">
          <View className="bg-orange-100 rounded-full p-1 mr-2">
            <Ionicons name="restaurant" size={12} color="#f97316" />
          </View>
          <Text className="text-xs text-gray-400">AI Chef</Text>
        </View>
      )}
    </Animated.View>
  );
};