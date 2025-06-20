import { TextInput, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getRecipesQuery } from "@/lib/api";
import { Text } from "@/components/ui/text";
import { ActivityIndicator } from "react-native";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { SectionHeader } from "@/components/recipes/SectionHeader";
import { useState } from "react";
import { CategoryCard } from "@/components/recipes/CategoryCard";
import { FontAwesome } from '@expo/vector-icons';
import FiltersModal from "@/components/search/FiltersModal";
import CategoryModal from "@/components/recipes/CategoryModal";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    dietary: [] as string[],
    cookingTime: "",
    difficulty: "",
    cuisine: [] as string[],
    servings: "",
    rating: ""
  });

  const { data, isPending, error } = useQuery({
    queryKey: ["recipes", debouncedSearch],
    queryFn: () => getRecipesQuery(),
  });

  const placeholderTexts = [
    "Find recipes by ingredients or diet 🥕",
    "Search cooking techniques or cuisines 🔍 ?",
    "What's in your pantry? Let's find ideas! 🧅",
    "Browse trending recipes now 📈",
    "Dietary needs ? 🌱 Let's tackle it ...",
  ];

  const categories = {
    regions: [
      {name: "Asian", icon: "🥡"},
      {name: "Italian", icon: "🍝"},
      {name: "Mexican", icon: "🌮"},
      {name: "Indian", icon: "🍛"},
      {name: "French", icon: "🥐"},
      {name: "Mediterranean", icon: "🫒"},
      {name: "Middle Eastern", icon: "🧆"},
      {name: "American", icon: "🍔"}
    ],
    dietary: [
      {name: "Vegetarian", icon: "🥗"},
      {name: "Vegan", icon: "🌱"},
      {name: "Gluten Free", icon: "🌾"},
      {name: "Keto", icon: "🥑"},
      {name: "Low Carb", icon: "🥩"},
      {name: "Paleo", icon: "🍖"},
      {name: "Dairy Free", icon: "🥛"}
    ],
    mealType: [
      {name: "Breakfast", icon: "🍳"},
      {name: "Lunch", icon: "🥪"},
      {name: "Dinner", icon: "🍽️"},
      {name: "Desserts", icon: "🍰"},
      {name: "Snacks", icon: "🍿"},
      {name: "Drinks", icon: "🍹"}
    ],
    cookingMethod: [
      {name: "Grilling", icon: "🔥"},
      {name: "Baking", icon: "🥖"},
      {name: "Slow Cooking", icon: "🍲"},
      {name: "Air Fryer", icon: "♨️"},
      {name: "One Pot", icon: "🥘"},
      {name: "No Cook", icon: "🥬"}
    ],
    difficulty: [
      {name: "Easy", icon: "👶"},
      {name: "Medium", icon: "👨‍🍳"},
      {name: "Hard", icon: "👨‍🎓"}
    ],
    duration: [
      {name: "< 15 mins", value: "15"},
      {name: "< 30 mins", value: "30"},
      {name: "< 45 mins", value: "45"},
      {name: "< 60 mins", value: "60"},
      {name: "60+ mins", value: "61"}
    ]
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-50" edges={['top', 'left', 'right']}>
      <View className="flex-row items-center px-4 pt-3 pb-4 bg-muted/20">
        <View className="flex-1 relative">
          <TextInput
            className="w-full pl-12 pr-5 py-5 bg-white font-medium rounded-xl drop-shadow-lg"
            style={{
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }}
            placeholder={!isFocused ? placeholderTexts[Math.floor(Math.random() * placeholderTexts.length)] : ""}
            placeholderTextColor="#71717a"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <View className="absolute left-5 top-1/2 -translate-y-1/2">
            <FontAwesome name="search" size={20} color="#71717a" />
          </View>
        </View>
        <Pressable 
          className="ml-4 p-3 bg-orange-100 rounded-lg"
          onPress={() => setShowFilters(true)}
        >
          <FontAwesome name="sliders" size={20} color="#c2410c" />
        </Pressable>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false} 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Categories Section */}
        <View className="mt-2">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <Text className="text-xl font-bold text-gray-900">Popular Categories</Text>
            <Pressable
              onPress={() => setShowCategoryModal(true)}
              className="bg-orange-100 px-4 py-2 rounded-full"
            >
              <Text className="text-sm font-medium text-orange-700">See All</Text>
            </Pressable>
          </View>

          <ScrollView 
            horizontal 
            className="pl-6" 
            showsHorizontalScrollIndicator={false}
          >
            {(() => {
              const allCategories = [
                ...categories.regions,
                ...categories.dietary,
                ...categories.mealType,
                ...categories.cookingMethod
              ];
              
              return allCategories
                .sort(() => Math.random() - 0.5)
                .slice(0, 6)
                .map((category, index) => (
                  <View key={index} className="mr-3">
                    <CategoryCard 
                      name={category.name}
                      icon={category.icon}
                    />
                  </View>
                ));
            })()}
          </ScrollView>
        </View>

        {/* Recent Recipes Section */}
        <View className="mt-2">
          <SectionHeader title="Recent Recipes" />
          <ScrollView 
            horizontal 
            className="pl-4 pt-2" 
            showsHorizontalScrollIndicator={false}
          >
            {isPending ? (
              <View className="flex-1 items-center justify-center py-8">
                <ActivityIndicator color="#f97316" />
              </View>
            ) : data?.slice(0, 5)?.map(recipe => (
              <View key={recipe._id}>
                <RecipeCard recipe={recipe} minimal={true}/>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <FiltersModal
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        categories={categories}
      />
      
      <CategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onCategorySelect={(categoryName) => {
          setSearchTerm(categoryName);
          // You can also update activeFilters here if needed
        }}
      />
    </SafeAreaView>
  );
}
