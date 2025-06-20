import { Pressable, View, Text, Image } from "react-native";

export function CategoryCard({ 
  name, 
  icon = "🍽️",
  onPress,
  variant = "minimal"
}: { 
  name: string;
  icon?: string;
  onPress?: () => void;
  variant?: "minimal" | "full";
}) {
  if (variant === "minimal") {
    return (
      <Pressable 
        className="h-32 aspect-square m-1"
        onPress={onPress}
      >
        {/* Icon container positioned above card */}
        <View 
          className="absolute z-10 top-2 left-1/2 -translate-x-1/2 w-20 h-14 bg-orange-100 rounded-xl items-center justify-center"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5
          }}
        >
          <Image 
            source={{ uri: `https://emojicdn.elk.sh/${icon}` }}
            className="w-10 h-10"
            resizeMode="contain"
          />
        </View>

        {/* Text container with fixed height */}
        <View 
          className="mt-10 h-16 w-full bg-white rounded-xl px-3 pt-7 pb-2"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 4
          }}
        >
          <Text 
            className="text-center font-semibold text-gray-800 text-base"
            numberOfLines={2}
          >
            {name}
          </Text>
        </View>
      </Pressable>
    );
  }

  // Full variant for the category page
  return (
    <Pressable 
      className="h-44 w-full mb-3"
      onPress={onPress}
    >
      <View 
        className="flex-1 bg-white rounded-2xl p-4 items-center justify-center"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5
        }}
      >
        {/* Icon container */}
        <View 
          className="w-24 h-20 bg-orange-100 rounded-2xl items-center justify-center mb-3"
        >
          <Image 
            source={{ uri: `https://emojicdn.elk.sh/${icon}` }}
            className="w-14 h-14"
            resizeMode="contain"
          />
        </View>

        <Text 
          className="text-center font-bold text-gray-800 text-lg"
          numberOfLines={2}
        >
          {name}
        </Text>
      </View>
    </Pressable>
  );
}