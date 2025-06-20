import { Modal, SafeAreaView, View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface FiltersModalProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFilters: {
    dietary: string[];
    cookingTime: string;
    difficulty: string;
    cuisine: string[];
    servings: string;
    rating: string;
  };
  setActiveFilters: (filters: any) => void;
  categories: {
    dietary: Array<{name: string, icon: string}>;
    difficulty: Array<{name: string, icon: string}>;
    duration: Array<{name: string, value: string}>;
  };
}

export default function FiltersModal({
  showFilters,
  setShowFilters,
  activeFilters,
  setActiveFilters,
  categories
}: FiltersModalProps) {
    
    return <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <SafeAreaView className="flex-1 bg-orange-50">
          <View className="px-6 py-4 border-b border-orange-100 bg-white shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-gray-900">Refine Search</Text>
              <Pressable 
                onPress={() => setShowFilters(false)}
                className="bg-orange-100 p-2 rounded-xl"
                hitSlop={8}
              >
                <Ionicons name="close" size={24} color="#ca3500" />
              </Pressable>
            </View>
          </View>

          <ScrollView className="flex-1 px-6">
            {/* Dietary Preferences */}
            <View className="py-6 border-b border-orange-100">
              <Text className="text-lg font-semibold text-gray-900 mb-4">Dietary Preferences</Text>
              <View className="flex-row flex-wrap gap-2">
                {categories.dietary.map((diet, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setActiveFilters((prev: { dietary: string[]; }) => ({
                        ...prev,
                        dietary: prev.dietary.includes(diet.name)
                          ? prev.dietary.filter(d => d !== diet.name)
                          : [...prev.dietary, diet.name]
                      }));
                    }}
                    className={`px-4 py-2.5 rounded-xl border ${
                      activeFilters.dietary.includes(diet.name)
                        ? 'bg-orange-500 border-orange-500'
                        : 'bg-white border-orange-200'
                    }`}
                  >
                    <Text 
                      className={`text-base ${activeFilters.dietary.includes(diet.name) ? 'text-white' : 'text-gray-700'}`}
                    >
                      {diet.icon} {diet.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Difficulty Level */}
            <View className="py-6 border-b border-orange-100">
              <Text className="text-lg font-semibold text-gray-900 mb-4">Difficulty Level</Text>
              <View className="flex-row gap-3">
                {categories.difficulty.map((level, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setActiveFilters((prev: { difficulty: string; }) => ({
                        ...prev,
                        difficulty: prev.difficulty === level.name ? "" : level.name
                      }));
                    }}
                    className={`flex-1 py-3 rounded-xl border ${
                      activeFilters.difficulty === level.name
                        ? 'bg-orange-500 border-orange-500'
                        : 'bg-white border-orange-200'
                    }`}
                  >
                    <Text 
                      className={`text-center text-base ${
                        activeFilters.difficulty === level.name ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {level.icon}{"\n"}{level.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Rating Filter */}
            <View className="py-6 border-b border-orange-100">
              <Text className="text-lg font-semibold text-gray-900 mb-4">Minimum Rating</Text>
              <View className="flex-row justify-between">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Pressable
                    key={rating}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setActiveFilters((prev) => ({
                        ...prev,
                        rating: activeFilters.rating === rating.toString() ? "" : rating.toString()
                      }));
                    }}
                    className={`items-center px-4 py-3 rounded-xl border ${
                      activeFilters.rating === rating.toString()
                        ? 'bg-orange-500 border-orange-500'
                        : 'bg-white border-orange-200'
                    }`}
                  >
                    <View className="flex-row items-center gap-1">
                      <FontAwesome 
                        name="star" 
                        size={20} 
                        color={activeFilters.rating === rating.toString() ? "#fff" : "#FBBF24"} 
                      />
                      <Text className={`text-base ${
                        activeFilters.rating === rating.toString() ? 'text-white' : 'text-gray-700'
                      }`}>
                        {rating}+
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          <View className="p-6 bg-white border-t border-orange-100">
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveFilters({
                    dietary: [],
                    cookingTime: "",
                    difficulty: "",
                    cuisine: [],
                    servings: "",
                    rating: ""
                  });
                }}
                className="flex-1 py-3.5 rounded-xl border border-orange-500"
              >
                <Text className="text-orange-500 font-semibold text-center">Reset All</Text>
              </Pressable>
              
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setShowFilters(false);
                }}
                className="flex-2 bg-orange-500 py-3.5 rounded-xl flex-1"
              >
                <Text className="text-white font-semibold text-center">Apply Filters</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
}