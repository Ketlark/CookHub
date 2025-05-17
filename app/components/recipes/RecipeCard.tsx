import { View, Image } from "react-native";
import { Text } from "@/components/ui/text";
import type { Recipe } from "@/lib/api";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <View className="w-48 mr-8 overflow-hidden rounded-lg bg-card dark:border-border/50 dark:bg-card/90">
      <View className="rounded-xl bg-background shadow-sm overflow-hidden">
        {recipe.metadata.image_url ? (
          <Image source={{ uri: recipe.metadata.image_url }} className="w-full h-32 rounded-xl" />
        ) : (
          <View className="w-full h-32 bg-muted/50 items-center justify-center rounded-xl">
            <Text className="text-foreground/50 text-sm">No image available</Text>
          </View>
        )}
        <View className="p-3">
          <Text className="font-bold text-sm mb-1" numberOfLines={1}>
            {recipe.title}
          </Text>
          <Text className="text-gray-600 text-xs mb-2" numberOfLines={2}>
            {recipe.description}
          </Text>
          <Text className="text-xs text-gray-500">Difficulty: {recipe.difficulty || "Easy"}</Text>
        </View>
      </View>
    </View>
  );
}
