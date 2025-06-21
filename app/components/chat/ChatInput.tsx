import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolateColor } from 'react-native-reanimated';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * ChatInput component for message input with send button
 * Features haptic feedback, auto-focus, and animated send button
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
  disabled = false,
  placeholder = "Ask me anything about cooking..."
}) => {
  const inputRef = useRef<TextInput>(null);
  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(value.trim().length > 0 ? 1 : 0.5);

  // Auto-focus input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Update button opacity based on input value
  useEffect(() => {
    buttonOpacity.value = withSpring(value.trim().length > 0 ? 1 : 0.5);
  }, [value, buttonOpacity]);

  const handleSend = () => {
    if (value.trim().length === 0 || disabled) return;
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Button animation
    buttonScale.value = withSpring(0.9, { duration: 100 }, () => {
      buttonScale.value = withSpring(1);
    });
    
    onSend();
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
      opacity: buttonOpacity.value,
    };
  });

  const animatedButtonColorStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      buttonOpacity.value,
      [0.5, 1],
      ['#fed7aa', '#f97316'] // orange-200 to orange-500
    );
    
    return {
      backgroundColor,
    };
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View 
        className="bg-white border-t border-gray-200 px-4 py-3"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <View className="flex-row items-end space-x-3">
          {/* Text Input */}
          <View className="flex-1">
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={500}
              editable={!disabled}
              className="
                bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3
                text-gray-900 text-base leading-relaxed
                min-h-[44px] max-h-[120px]
              "
              style={{
                textAlignVertical: 'top',
              }}
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
              returnKeyType="send"
              enablesReturnKeyAutomatically
            />
          </View>

          {/* Send Button */}
          <Animated.View style={[animatedButtonStyle]}>
            <TouchableOpacity
              onPress={handleSend}
              disabled={value.trim().length === 0 || disabled}
              activeOpacity={0.8}
              className="rounded-full p-3"
            >
              <Animated.View 
                style={[animatedButtonColorStyle]}
                className="rounded-full p-2"
              >
                <Ionicons 
                  name="send" 
                  size={20} 
                  color="white"
                />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Character Counter */}
        {value.length > 400 && (
          <View className="flex-row justify-end mt-1">
            <View className="bg-gray-100 rounded-full px-2 py-1">
              <Text 
                className={`text-xs ${
                  value.length > 480 ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {value.length}/500
              </Text>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};