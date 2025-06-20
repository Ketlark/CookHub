import { Modal, View, ScrollView, Pressable, TextInput } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

interface CreateCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateCollection: (title: string, description: string, tags: string[]) => void;
}

export default function CreateCollectionModal({ visible, onClose, onCreateCollection }: CreateCollectionModalProps) {
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snacks",
    "Healthy",
    "Quick",
    "Vegetarian",
    "Vegan",
    "Italian",
    "Asian",
    "Mexican",
    "Baking",
    "Grilling",
    "One Pot",
  ];

  const toggleTag = (tag: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };

  const handleCreateCollection = () => {
    if (newCollectionTitle.trim() === "") return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onCreateCollection(newCollectionTitle.trim(), newCollectionDescription.trim(), selectedTags);

    // Reset form
    setNewCollectionTitle("");
    setNewCollectionDescription("");
    setSelectedTags([]);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Reset form when closing
    setNewCollectionTitle("");
    setNewCollectionDescription("");
    setSelectedTags([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <SafeAreaView className="flex-1 bg-orange-50">
        {/* Header */}
        <View className="px-6 py-4 border-b border-orange-100 bg-white shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">Create Collection</Text>
              <Text className="text-sm text-gray-500 mt-1 mb-2">Organize your favorite recipes</Text>
            </View>
            <Pressable onPress={handleClose} className="bg-orange-100 p-2 rounded-xl" hitSlop={8}>
              <Ionicons name="close" size={24} color="#ca3500" />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(300)} className="mt-6">
            {/* Collection Title */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Collection Name *</Text>
              <TextInput
                className="bg-white rounded-xl p-4 text-base text-gray-900 border border-orange-200 shadow-sm"
                placeholder="Enter collection name"
                value={newCollectionTitle}
                onChangeText={setNewCollectionTitle}
                maxLength={50}
                placeholderTextColor="#9CA3AF"
              />
              <Text className="text-xs text-gray-500 mt-2">{newCollectionTitle.length}/50 characters</Text>
            </View>

            {/* Collection Description */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Description</Text>
              <TextInput
                className="bg-white rounded-xl p-4 text-base text-gray-900 border border-orange-200 shadow-sm h-24"
                placeholder="Describe your collection (optional)"
                value={newCollectionDescription}
                onChangeText={setNewCollectionDescription}
                multiline
                textAlignVertical="top"
                maxLength={150}
                placeholderTextColor="#9CA3AF"
              />
              <Text className="text-xs text-gray-500 mt-2">{newCollectionDescription.length}/150 characters</Text>
            </View>

            {/* Tags Selection */}
            <View className="mb-8">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Tags (Optional)</Text>
              <Text className="text-sm text-gray-600 mb-4">Select tags to help categorize your collection</Text>
              <View className="flex-row flex-wrap gap-2">
                {availableTags.map(tag => (
                  <Pressable
                    key={tag}
                    className={`px-4 py-2.5 rounded-xl border ${
                      selectedTags.includes(tag) ? "bg-orange-500 border-orange-500" : "bg-white border-orange-200"
                    }`}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text className={`text-base font-medium ${selectedTags.includes(tag) ? "text-white" : "text-gray-700"}`}>{tag}</Text>
                  </Pressable>
                ))}
              </View>
              {selectedTags.length > 0 && (
                <Text className="text-xs text-gray-500 mt-3">
                  {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""} selected
                </Text>
              )}
            </View>
          </Animated.View>

          {/* Add some bottom padding for better scrolling experience */}
          <View className="h-20" />
        </ScrollView>
        {/* Action Buttons - Outside SafeAreaView to avoid bottom safe area */}
        <View className="p-6 bg-white border-t border-orange-100">
          <View className="flex-row gap-3">
            <Pressable onPress={handleClose} className="flex-1 py-3.5 rounded-xl border border-orange-500">
              <Text className="text-orange-500 font-semibold text-center">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleCreateCollection}
              className={`flex-1 py-3.5 rounded-xl ${newCollectionTitle.trim() === "" ? "bg-gray-300" : "bg-orange-500"}`}
              disabled={newCollectionTitle.trim() === ""}
            >
              <Text className="text-white font-semibold text-center">Create Collection</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
