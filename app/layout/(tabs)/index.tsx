import { FlatList, SafeAreaView, TextInput, View, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getRecipesQuery } from "@/lib/api";
import { Text } from "@/components/ui/text";
import { ActivityIndicator } from "react-native";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { ArticleCard } from "@/components/recipes/ArticleCard";
import { SectionHeader } from "@/components/recipes/SectionHeader";
import { useState } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isPending, error } = useQuery({
    queryKey: ["recipes", debouncedSearch],
    queryFn: () => getRecipesQuery(), //{ search: debouncedSearch }),
  });

  const placeholderTexts = [
    "Find recipes by ingredients or diet 🥕",
    "Search cooking techniques or cuisines 🔍 ?",
    "What's in your pantry? Let's find ideas! 🧅",
    "Browse trending recipes now 📈",
    "Dietary needs ? 🌱 Let's tackle it ...",
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 pt-3 pb-6 bg-muted/20">
        <TextInput
          className="p-5 bg-background font-medium rounded-3xl drop-shadow-lg border border-input"
          style={{
            textAlign: "center",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          }}
          placeholder={placeholderTexts[Math.floor(Math.random() * placeholderTexts.length)]}
          placeholderTextColor="#71717a"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <SectionHeader title="Trendy Recipes" />
        <ScrollView horizontal className="pl-4 py-2" showsHorizontalScrollIndicator={false}>
          {data?.slice(0, 5)?.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </ScrollView>

        <SectionHeader title="Last Viewed" />
        <ScrollView horizontal className="pl-4 py-2">
          {/* Placeholder for last viewed recipes */}
          <View className="w-48 m-2 items-center justify-center h-32 bg-muted/50 rounded-lg">
            <Text className="text-foreground/50">Coming soon</Text>
          </View>
        </ScrollView>

        <SectionHeader title="Latest Articles" />
        <ScrollView horizontal className="pl-2 py-2">
          {[
            { id: 1, title: "10 Secrets to Perfect Risotto", excerpt: "Master the creamy Italian classic", image: "📘" },
            { id: 2, title: "Knife Skills 101", excerpt: "Chop like a pro with these tips", image: "🔪" },
            { id: 3, title: "Spice Up Your Life", excerpt: "Global seasoning guide", image: "🌶️" },
            { id: 4, title: "Leftover Magic Tricks", excerpt: "Transform meals creatively", image: "♻️" },
          ].map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </ScrollView>
      </ScrollView>

      {/* Loading and error states */}
      {isPending ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500">Error loading content</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          keyExtractor={item => item._id}
          numColumns={2}
          className="flex-1"
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
