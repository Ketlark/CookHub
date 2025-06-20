import { Text } from "@/components/ui/text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, View, ScrollView, ImageBackground, Pressable, ActivityIndicator, Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getRecipesQuery, Recipe } from "@/lib/api";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown, FadeInUp, interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

interface Ingredient {
  quantity: string;
  unit: string;
  name: string;
  note?: string;
}

interface DetailedRecipe extends Recipe {
  ingredients?: Ingredient[];
  instructions?: string[];
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fats: string;
  };
  cookingTime?: number;
  servings?: number;
}

const styles = StyleSheet.create({
  navButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },
  followButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  tabText: {
    fontWeight: "600",
    fontSize: 15,
    color: "#9ca3af",
  },
  activeTabText: {
    color: "#ea580c",
    fontWeight: "700",
  },
  checkButton: {
    width: 24,
    height: 24,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function RecipeDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">("ingredients");
  const [isSaved, setIsSaved] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const { width } = Dimensions.get("window");

  // Animation for tab switching
  const tabAnimation = useSharedValue(0);

  const animatedTabStyle = useAnimatedStyle(() => {
    // Use percentage-based calculation for true responsiveness
    // Each tab occupies 50% of container width, so translate by 50% for second tab
    const translateXPercentage = interpolate(tabAnimation.value, [0, 1], [0, 50]);

    return {
      transform: [{ translateX: `${translateXPercentage}%` }],
    };
  });

  // Mock data for demonstration - in real app, you'd fetch by ID
  const { data: recipes, isPending } = useQuery({
    queryKey: ["recipes"],
    queryFn: () => getRecipesQuery(),
  });

  const recipe = recipes?.find(r => r._id === id);

  // Mock detailed data that would come from a detailed recipe API
  const mockDetailedData: Partial<DetailedRecipe> = {
    ingredients: [
      {
        quantity: "2",
        unit: "pcs",
        name: "Chicken Egg",
      },
      {
        quantity: "2",
        unit: "pcs",
        name: "English Muffins",
        note: "Preferably whole wheat",
      },
      {
        quantity: "4",
        unit: "slices",
        name: "Bacon",
        note: "Smoked",
      },
      {
        quantity: "30",
        unit: "grams",
        name: "Butter",
        note: "Unsalted",
      },
      {
        quantity: "2",
        unit: "tbsp",
        name: "Hollandaise Sauce",
        note: "Freshly made",
      },
      {
        quantity: "",
        unit: "",
        name: "Salt and pepper",
        note: "To taste",
      },
      {
        quantity: "",
        unit: "",
        name: "Fresh chives",
        note: "For garnish",
      },
    ],
    instructions: [
      "Add The Onion, Garlic, Chives, And Peppercorns. Simmer For At Least Two Hours.",
      "Strain The Broth And Pour Back Into The Pot. Discard The Solids And Aromatics.",
      "Heat The Broth Until Simmering.",
      "Season with salt and pepper. Serve hot with fresh herbs.",
    ],
    nutrition: {
      calories: 120,
      protein: "27g",
      carbs: "65g",
      fats: "91g",
    },
    cookingTime: 12,
    servings: 2,
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  if (isPending) {
    return (
      <View className="flex-1 bg-orange-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View className="flex-1 bg-orange-50">
        <View className="flex-1 justify-center items-center px-6 pt-12">
          <Text className="text-xl font-bold text-gray-800 mb-2">Recipe Not Found</Text>
          <Text className="text-gray-600 text-center mb-6">The recipe you're looking for doesn't exist or has been removed.</Text>
          <Pressable onPress={handleBack} className="bg-orange-500 px-6 py-3 rounded-xl">
            <Text className="text-white font-semibold">Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-orange-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Image - Full bleed to top of screen */}
        <View className="relative">
          <ImageBackground source={{ uri: recipe.metadata.image_url }} style={{ height: width * 0.85 }} resizeMode="cover">
            <LinearGradient colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.3)", "transparent"]} className="flex-1">
              {/* Top Navigation - Positioned with top padding for status bar */}
              <View className="flex-row justify-between items-center px-6 pt-[env(safe-area-inset-top)] pb-3">
                <Pressable onPress={handleBack} style={styles.navButton}>
                  <Ionicons name="chevron-back" size={22} color="white" />
                </Pressable>

                <View className="flex-row gap-3">
                  <Pressable style={styles.navButton}>
                    <Ionicons name="share-outline" size={20} color="white" />
                  </Pressable>
                  <Pressable onPress={handleSave} style={styles.navButton}>
                    <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={20} color={isSaved ? "#f97316" : "white"} />
                  </Pressable>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Content */}
        <View className="bg-orange-50 rounded-t-3xl px-6 pb-6 shadow-sm border border-orange-100" style={{ marginTop: -30 }}>
          {/* Recipe Header */}
          <Animated.View entering={FadeInUp.delay(100).duration(500)} className="mb-4 pt-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="bg-orange-500 px-4 py-2 rounded-full shadow-sm">
                <Text className="text-white font-semibold text-sm">Vegan</Text>
              </View>
              <View className="flex-row items-center bg-white px-3 py-2 rounded-full shadow-lg border border-orange-100">
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text className="text-gray-800 font-bold text-sm ml-1">4.8</Text>
                <Text className="text-gray-500 text-xs ml-1">(124)</Text>
              </View>
            </View>

            <Text className="text-gray-900 text-3xl font-bold leading-tight mb-2">{recipe.title}</Text>
            <Text className="text-gray-600 text-base leading-relaxed">{recipe.description}</Text>
          </Animated.View>
          {/* Recipe Stats */}
          <Animated.View entering={FadeInUp.delay(200).duration(500)}>
            <View className="flex-row justify-between mb-6">
              <View className="bg-white rounded-2xl p-4 flex-1 mr-2 items-center border border-orange-100">
                <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="time-outline" size={20} color="#ea580c" />
                </View>
                <Text className="text-gray-900 font-bold text-base">{mockDetailedData.cookingTime} min</Text>
                <Text className="text-orange-600 text-xs font-medium">Cook time</Text>
              </View>

              <View className="bg-white rounded-2xl p-4 flex-1 mx-1 items-center border border-orange-100">
                <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="people-outline" size={20} color="#ea580c" />
                </View>
                <Text className="text-gray-900 font-bold text-base">{mockDetailedData.servings}</Text>
                <Text className="text-orange-600 text-xs font-medium">Servings</Text>
              </View>

              <View className="bg-white rounded-2xl p-4 flex-1 ml-2 items-center border border-orange-100">
                <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="flame-outline" size={20} color="#ea580c" />
                </View>
                <Text className="text-gray-900 font-bold text-base">{mockDetailedData.nutrition?.calories}</Text>
                <Text className="text-orange-600 text-xs font-medium">Calories</Text>
              </View>
            </View>
          </Animated.View>

          {/* Tab Navigation */}
          <Animated.View entering={FadeInUp.delay(100).duration(200)}>
            <View className="bg-orange-100/80 rounded-2xl p-1.5 flex-row mb-6 shadow-sm relative">
              {/* Animated Tab Indicator */}
              <Animated.View
                className="absolute inset-1.5 w-1/2 bg-white rounded-xl shadow-lg"
                style={[
                  {
                    shadowColor: "#f97316",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 4,
                  },
                  animatedTabStyle,
                ]}
              />

              <Pressable
                onPress={() => {
                  if (activeTab !== "ingredients") {
                    setActiveTab("ingredients");
                    tabAnimation.value = withSpring(0, { damping: 25, stiffness: 400, mass: 0.7 });
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }
                }}
                style={styles.tabButton}
              >
                <Text style={[styles.tabText, activeTab === "ingredients" && styles.activeTabText]}>Ingredients</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  if (activeTab !== "instructions") {
                    setActiveTab("instructions");
                    tabAnimation.value = withSpring(1, { damping: 25, stiffness: 400, mass: 0.7 });
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }
                }}
                style={styles.tabButton}
              >
                <Text style={[styles.tabText, activeTab === "instructions" && styles.activeTabText]}>Instructions</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Tab Content */}
          <View className="pb-8">
            {activeTab === "ingredients" ? (
              <Animated.View entering={FadeIn.duration(300)}>
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-xl font-bold text-gray-900">Ingredients</Text>
                  <View className="bg-orange-100 px-3 py-1.5 rounded-full">
                    <Text className="text-orange-600 font-bold text-sm">{mockDetailedData.ingredients?.length || 0}</Text>
                  </View>
                </View>
                <View className="gap-1">
                  {mockDetailedData.ingredients?.map((ingredient, index) => (
                    <Animated.View
                      key={index}
                      entering={FadeInDown.delay(index * 50).duration(300)}
                      className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm"
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                          <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
                            <Ionicons name="nutrition-outline" size={24} color="#ea580c" />
                          </View>
                          <View className="ml-4 flex-1">
                            <Text className="text-gray-900 font-semibold text-sm" numberOfLines={1}>
                              {ingredient.name}
                            </Text>
                            {ingredient.note && (
                              <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={1}>
                                {ingredient.note}
                              </Text>
                            )}
                          </View>
                        </View>
                        {(ingredient.quantity || ingredient.unit) && (
                          <View className="bg-orange-500 px-3 py-1.5 rounded-full ml-2 shadow-sm">
                            <Text className="text-white text-xs font-bold">
                              {`${ingredient.quantity}${ingredient.unit ? " " + ingredient.unit : ""}`}
                            </Text>
                          </View>
                        )}
                      </View>
                    </Animated.View>
                  ))}
                </View>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeIn.duration(300)}>
                <Text className="text-xl font-bold mb-6 text-gray-900">Instructions</Text>
                <View className="relative">
                  {mockDetailedData.instructions?.map((instruction, index) => {
                    const isCompleted = completedSteps[index] || false;
                    const isLast = index === (mockDetailedData.instructions?.length || 0) - 1;

                    return (
                      <Animated.View key={index} entering={FadeInDown.delay(index * 100).duration(400)} className="flex-row mb-6 relative">
                        {/* Timeline segment - dynamic connection to next step */}
                        {!isLast && (
                          <View
                            className="absolute left-6 w-0.5 bg-orange-200"
                            style={{
                              top: 48,
                              bottom: -48,
                            }}
                          />
                        )}

                        {/* Step Number - Centered on Y axis */}
                        <View className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
                          <View className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center border-4 border-white shadow-sm">
                            <Text className="text-white font-bold text-base">{index + 1}</Text>
                          </View>
                        </View>

                        {/* Instruction Card */}
                        <View className="flex-1 ml-20 bg-white rounded-2xl p-4 border border-orange-100 shadow-sm">
                          <View className="flex-row items-start justify-between">
                            <View className="flex-1 pr-3">
                              <Text className="text-base text-gray-800 leading-6">{instruction}</Text>
                            </View>
                            <Pressable
                              onPress={() => {
                                const newCompletedSteps = [...completedSteps];
                                newCompletedSteps[index] = !isCompleted;
                                setCompletedSteps(newCompletedSteps);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              }}
                              style={[styles.checkButton, isCompleted && { backgroundColor: "#22c55e" }]}
                            >
                              {isCompleted && <Ionicons name="checkmark" size={16} color="white" />}
                            </Pressable>
                          </View>
                        </View>
                      </Animated.View>
                    );
                  })}
                </View>
              </Animated.View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
