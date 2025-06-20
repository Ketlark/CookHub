import { View, Image, ImageBackground, Pressable, GestureResponderEvent, useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { LinearGradient } from 'expo-linear-gradient';
import type { Recipe } from "@/lib/api";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

// Components
const RecipeTag = () => (
  <View className="bg-white/90 rounded-lg px-2.5 py-1 flex-row items-center">
    <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
    <Text className="text-xs font-medium text-gray-800">Vegan</Text>
  </View>
);

const BookmarkButton = ({ isSaved, onPress }: { isSaved: boolean; onPress: (e: GestureResponderEvent) => void }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  const handlePressIn = (e: GestureResponderEvent) => {
    scale.value = withSpring(0.8, { damping: 15, stiffness: 400 })
    onPress(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 })
  };

  return (
    <Pressable 
      className="bg-white/95 rounded-lg w-8 h-8 items-center justify-center"
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={8}
    >
      <Animated.View style={animatedStyle}>
        <Ionicons 
          name={isSaved ? "bookmark" : "bookmark-outline"} 
          size={20} 
          color={isSaved ? "orange" : "#1f2937"}
        />
      </Animated.View>
    </Pressable>
  );
};

const RecipeAuthor = ({ authorImage, authorName }: { authorImage?: string; authorName?: string }) => (
  <View className="flex-row items-center flex-1">
    <Image 
      source={{ uri: authorImage || "https://randomuser.me/api/portraits/men/32.jpg" }}
      className="w-5 h-5 rounded-full"
    />
    <Text className="text-white/90 text-xs ml-2 flex-1" numberOfLines={1}>
      {authorName || "Chef Michael"}
    </Text>
  </View>
);

const RecipeStats = ({ duration }: { duration?: string }) => (
  <View className="flex-row items-center gap-3">
    <View className="flex-row items-center">
      <Ionicons name="time-outline" size={14} color="white" />
      <Text className="text-white/90 text-xs ml-1">
        {duration || '30m'}
      </Text>
    </View>
    
    <View className="flex-row items-center bg-white/20 rounded-lg px-2 py-1">
      <Ionicons name="star" size={12} color="#FBBF24" />
      <Text className="text-white text-xs ml-1">4.8</Text>
    </View>
  </View>
);

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
  minimal?: boolean;
}

export function RecipeCard({ recipe, className = "", minimal = false }: RecipeCardProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const { width } = useWindowDimensions();

  const handlePress = () => {
    router.navigate(`./recipes/${recipe._id}`);
  };

  const handleSave = (e: GestureResponderEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  if (minimal) {
    const cardWidth = (width - 48) / 2; // 32 = total horizontal padding
    return (
      <Pressable 
        className={`mx-2 bg-white rounded-xl overflow-hidden shadow-sm ${className}`}
        style={{ width: cardWidth }}
        onPress={handlePress}
      >
        <ImageBackground 
          source={{ uri: recipe.metadata.image_url }} 
          className="h-40"
          imageStyle={{ borderRadius: 12 }}
        >
          <LinearGradient 
            colors={['#00000000', '#000000CC']} 
            style={{height: '100%', width: '100%'}} 
            start={{x: 0.5, y: 0.3}} 
            end={{x: 0.5, y: 1}}
          >
            <View className="flex-1 justify-between p-3">
              <View className="flex-row justify-start">
                <RecipeTag />
              </View>

              <View>
                <Text className="font-bold text-white text-sm mb-2" numberOfLines={2}>
                  {recipe.title}
                </Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={14} color="white" />
                    <Text className="text-white/90 text-xs ml-1">
                      {recipe.duration || '30m'}
                    </Text>
                  </View>
                  <View className="flex-row items-center bg-white/20 rounded-lg px-2 py-1">
                    <Ionicons name="star" size={12} color="#FBBF24" />
                    <Text className="text-white text-xs ml-1">4.8</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Pressable>
    );
  }

  return (
    <Pressable 
      className={`mb-3 bg-white rounded-xl overflow-hidden shadow-sm ${className}`}
      onPress={handlePress}
    >
      <ImageBackground 
        source={{ uri: recipe.metadata.image_url }} 
        className="h-52"
        imageStyle={{ borderRadius: 12 }}
      >
        <LinearGradient 
          colors={['#00000000', '#000000CC']} 
          style={{height: '100%', width: '100%'}} 
          start={{x: 0.5, y: 0.3}} 
          end={{x: 0.5, y: 1}}
        >
          <View className="flex-1 justify-between p-3">
            {/* Top Row */}
            <View className="flex-row justify-between items-start">
              <RecipeTag />
              <BookmarkButton isSaved={isSaved} onPress={handleSave} />
            </View>

            {/* Bottom Content */}
            <View>
              <Text className="font-bold text-white text-lg mb-2" numberOfLines={2}>
                {recipe.title}
              </Text>
              
              <View className="flex-row items-center justify-between">
                <RecipeAuthor 
                  authorImage={recipe.metadata.author_image}
                  authorName={recipe.metadata.author}
                />
                <RecipeStats duration={recipe.duration} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}