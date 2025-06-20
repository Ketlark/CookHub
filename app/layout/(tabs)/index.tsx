import { View, ScrollView, Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getRecipesQuery, Recipe } from "@/lib/api";
import { Text } from "@/components/ui/text";
import { ActivityIndicator } from "react-native";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback, useMemo, useRef, SetStateAction } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";

// Constants
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 100,
};

const TAB_BUTTON_HEIGHT = 36;

// Components
const TabButton = ({ isActive, onPress, children }) => {
  return (
    <Pressable
      onPress={onPress}
      className="px-6 py-2 z-10"
    >
      <Text 
        className={`text-base font-medium ${
          isActive ? 'text-gray-900' : 'text-gray-600'
        }`}
      >
        {children}
      </Text>
    </Pressable>
  );
};

const LoadingSpinner = () => (
  <View className="flex-1 justify-center items-center pt-10">
    <ActivityIndicator size="large" />
  </View>
);

const RecipeList = ({ recipes, isLoading, width }) => (
  <ScrollView 
    style={{ width }}
    showsVerticalScrollIndicator={false}
    className="px-6"
    contentContainerClassName="gap-3"
  >
    {isLoading ? (
      <LoadingSpinner />
    ) : (
      recipes?.map((recipe: Recipe) => (
        <RecipeCard
          key={recipe._id}
          recipe={recipe}
        />
      ))
    )}
  </ScrollView>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const scrollX = useSharedValue(0);
  const { width } = useWindowDimensions();
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  // Calculate tab dimensions dynamically
  const tabDimensions = useMemo(() => {
    // Calculate based on text content + padding
    const firstTabWidth = 146; // Fixed width for "Trendy Recipes" tab
    const secondTabWidth = 90; // Fixed width for "For You" tab
    const totalWidth = firstTabWidth + secondTabWidth;
    
    return {
      firstTabWidth,
      secondTabWidth,
      totalWidth,
      translateDistance: firstTabWidth
    };
  }, []);

  // Queries
  const { data: trendyRecipes, isPending: trendyLoading } = useQuery({
    queryKey: ["trendy-recipes"],
    queryFn: () => getRecipesQuery(),
  });

  const { data: personalizedRecipes, isPending: personalizedLoading } = useQuery({
    queryKey: ["personalized-recipes"],
    queryFn: () => getRecipesQuery(),
  });

  // Event Handlers
  const switchTab = useCallback((index: number) => {
    setActiveTab(index);
    scrollX.value = withSpring(index * width, SPRING_CONFIG);
    // Scroll the ScrollView to the correct tab
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * width, animated: true });
    }
  }, [width, scrollX]);

  const handleScroll = useCallback((event: { nativeEvent: { contentOffset: { x: number; }; }; }) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  }, [scrollX]);

  const handleMomentumScrollEnd = useCallback((event: { nativeEvent: { contentOffset: { x: number; }; }; }) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveTab(newIndex);
  }, [width]);

  // Animated Styles
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      [0, width],
      [0, tabDimensions.translateDistance],
    );

    const widthValue = interpolate(
      scrollX.value,
      [0, width],
      [tabDimensions.firstTabWidth, tabDimensions.secondTabWidth],
    );

    return {
      transform: [{ translateX }],
      position: 'absolute',
      width: widthValue,
      height: TAB_BUTTON_HEIGHT,
      backgroundColor: 'white',
      borderRadius: 9999,
      top: 3,
      left: 3
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <View className="px-4 pt-2 pb-6">
        <View className="flex-row justify-center items-center">
          <View className="flex-row bg-orange-100/50 rounded-full p-1 relative">
            <Animated.View style={animatedBackgroundStyle} />
            <TabButton 
              isActive={activeTab === 0}
              onPress={() => switchTab(0)}
            >
              Trendy Recipes
            </TabButton>
            
            <TabButton
              isActive={activeTab === 1}
              onPress={() => switchTab(1)}
            >
              For You
            </TabButton>
          </View>
        </View>
      </View>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        <RecipeList 
          recipes={trendyRecipes}
          isLoading={trendyLoading}
          width={width}
        />

        <RecipeList
          recipes={personalizedRecipes}
          isLoading={personalizedLoading}
          width={width}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}