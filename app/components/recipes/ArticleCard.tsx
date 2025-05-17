import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

type Article = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  emoji?: string;
};

export function ArticleCard({ article }: { article: Article }) {
  return (
    <View className="w-52 bg-background rounded-xl p-3 shadow-sm">
      <View className="aspect-square rounded-lg bg-muted/50 mb-2 items-center justify-center">
        <Text className="text-3xl">{article.image}</Text>
      </View>

      <Text className="font-bold text-sm mb-1 text-foreground">
        {article.emoji && `${article.emoji} `}
        {article.title}
      </Text>

      <Text className="text-xs text-muted-foreground mb-2">{article.excerpt}</Text>

      <Link href={`./articles/${article.id}`} asChild>
        <TouchableOpacity>
          <Text className="text-xs text-primary font-medium">Read more →</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
