import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ChatBubble } from "../../components/chat/ChatBubble";
import { ChatInput } from "../../components/chat/ChatInput";
import { TypingIndicator } from "../../components/chat/TypingIndicator";
import { QuickActions } from "../../components/chat/QuickActions";
import { ChatMessage, generateUUID } from "../../types/chat";
import { getMockAIResponse } from "../../lib/api/ai-agent";

/**
 * Chat interface for AI cooking assistant
 * Full-screen chat with AI Chef featuring recipe suggestions, cooking tips, and more
 */
export default function ChatScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  // State management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sessionId] = useState(() => generateUUID());
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Welcome message on first load
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: generateUUID(),
      content:
        "Hello! I'm your AI cooking assistant. I can help you with recipe discovery, cooking tips, ingredient substitutions, and step-by-step cooking guidance. What would you like to cook today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
      metadata: {
        followUpQuestions: ["Find me some recipes", "I need cooking tips", "Help with substitutes", "Guide me through cooking"],
      },
    };

    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  const handleSendMessage = useCallback(
    async (messageText?: string) => {
      const textToSend = messageText || inputText.trim();
      if (!textToSend || isTyping) return;

      // Hide quick actions after first message
      setShowQuickActions(false);

      // Create user message
      const userMessage: ChatMessage = {
        id: generateUUID(),
        content: textToSend,
        sender: "user",
        timestamp: new Date(),
        type: "text",
      };

      // Add user message and clear input
      setMessages(prev => [...prev, userMessage]);
      setInputText("");
      setIsTyping(true);

      try {
        // Get AI response
        const aiResponse = await getMockAIResponse({
          message: textToSend,
          context: "general",
          sessionId,
        });

        // Create AI message
        const aiMessage: ChatMessage = {
          id: generateUUID(),
          content: aiResponse.message,
          sender: "ai",
          timestamp: new Date(),
          type: aiResponse.type,
          metadata: {
            recipes: aiResponse.recipes,
            followUpQuestions: aiResponse.followUpQuestions,
          },
        };

        setMessages(prev => [...prev, aiMessage]);

        // Show quick actions again after AI response if no recipes
        if (!aiResponse.recipes || aiResponse.recipes.length === 0) {
          setTimeout(() => setShowQuickActions(true), 1000);
        }
      } catch (error) {
        console.error("Failed to get AI response:", error);

        // Create error message
        const errorMessage: ChatMessage = {
          id: generateUUID(),
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          sender: "ai",
          timestamp: new Date(),
          type: "error",
        };

        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [inputText, isTyping, sessionId],
  );

  const handleQuickAction = useCallback(
    (query: string) => {
      handleSendMessage(query);
    },
    [handleSendMessage],
  );

  const handleRecipePress = useCallback(
    (recipeId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // Navigate to recipe detail page
      router.push(`/recipes/${recipeId}`);
    },
    [router],
  );

  const handleBackPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const handleClearChat = useCallback(() => {
    Alert.alert("Clear Chat", "Are you sure you want to clear all messages?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          setMessages([]);
          setShowQuickActions(true);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        },
      },
    ]);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      {/* Header */}
      <View
        className="bg-white border-b border-gray-200 px-4 py-3"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={handleBackPress} className="mr-3 p-2 -ml-2" activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={24} color="#374151" />
            </TouchableOpacity>

            <View className="flex-row items-center flex-1">
              <View className="bg-orange-100 rounded-full p-2 mr-3">
                <Ionicons name="restaurant" size={20} color="#f97316" />
              </View>
              <View>
                <Text className="text-lg font-bold text-gray-900">AI Chef</Text>
                <Text className="text-sm text-gray-500">{isTyping ? "Thinking..." : "Ready to help"}</Text>
              </View>
            </View>
          </View>

          {messages.length > 1 && (
            <TouchableOpacity onPress={handleClearChat} className="p-2" activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Messages Area */}
      <View className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Messages */}
          {messages.map(message => (
            <ChatBubble key={message.id} message={message} onRecipePress={handleRecipePress} />
          ))}

          {/* Typing Indicator */}
          <TypingIndicator visible={isTyping} />

          {/* Quick Actions */}
          <QuickActions visible={showQuickActions && !isTyping} onActionPress={handleQuickAction} />

          {/* Empty State */}
          {messages.length === 0 && !isTyping && (
            <Animated.View entering={FadeInDown.delay(500).springify()} className="items-center justify-center py-20">
              <View className="bg-orange-100 rounded-full p-6 mb-4">
                <Ionicons name="restaurant-outline" size={48} color="#f97316" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2 text-center">Welcome to AI Chef!</Text>
              <Text className="text-gray-600 text-center px-8 leading-relaxed">
                I'm here to help you with recipes, cooking tips, and culinary guidance. Ask me anything about cooking!
              </Text>
            </Animated.View>
          )}
        </ScrollView>
      </View>

      {/* Input Area */}
      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={() => handleSendMessage()}
        disabled={isTyping}
        placeholder="Ask me anything about cooking..."
      />
    </SafeAreaView>
  );
}
