import { TouchableOpacity, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

export default function Wizard() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex flex-1 bg-orange-50">
      {/* Header Section */}
      <View className="px-6 pt-8 pb-6">
        <Text className="text-4xl font-bold text-center text-gray-900">Kitchen Lab</Text>
        <Text className="text-lg text-center text-gray-600 mt-2">Let's create something delicious today</Text>
      </View>
      {/* Cards Section */}
      <View className="flex-1 px-4 pb-6">
        {/* Create New Recipe */}
        <TouchableOpacity
          className="bg-white mb-4 rounded-3xl p-6 shadow-lg"
          style={{
            shadowColor: "#f97316",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 5,
          }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/recipes/create");
          }}
          activeOpacity={0.95}
        >
          <View className="flex-row items-center">
            <View className="bg-orange-100 p-3 rounded-2xl mr-4">
              <Ionicons name="restaurant-outline" size={32} color="#f97316" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 mb-1">Create New Recipe</Text>
              <Text className="text-gray-600">Design your recipe step by step</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#f97316" />
          </View>
        </TouchableOpacity>

        {/* Import Recipe */}
        <TouchableOpacity
          className="bg-white mb-4 rounded-3xl p-6 shadow-lg"
          style={{
            shadowColor: "#f97316",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 5,
          }}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          activeOpacity={0.95}
        >
          <View className="flex-row items-center">
            <View className="bg-orange-100 p-3 rounded-2xl mr-4">
              <Ionicons name="cloud-download-outline" size={32} color="#f97316" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 mb-1">Import Recipe</Text>
              <Text className="text-gray-600">Import from other platforms</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#f97316" />
          </View>
        </TouchableOpacity>

        {/* Import from Photo */}
        <TouchableOpacity
          className="bg-white mb-4 rounded-3xl p-6 shadow-lg"
          style={{
            shadowColor: "#f97316",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 5,
          }}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
          activeOpacity={0.95}
        >
          <View className="flex-row items-center">
            <View className="bg-orange-100 p-3 rounded-2xl mr-4">
              <Ionicons name="camera-outline" size={32} color="#f97316" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 mb-1">Import from Photo</Text>
              <Text className="text-gray-600">Scan recipes from images</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#f97316" />
          </View>
        </TouchableOpacity>

        {/* Chat with AI Chef - Disabled until premium state is ready */}
        <View
          className="bg-gray-100 rounded-3xl p-6 shadow-lg opacity-50"
          style={{
            shadowColor: "#9ca3af",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center">
            <View className="bg-gray-200 p-3 rounded-2xl mr-4">
              <Ionicons name="chatbubble-outline" size={32} color="#9ca3af" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-500 mb-1">Chat with AI Chef</Text>
              <Text className="text-gray-400">Coming soon with premium features</Text>
            </View>
            <Ionicons name="lock-closed" size={24} color="#9ca3af" />
          </View>
        </View>
      </View>
      {/* Bottom Note */}
      <View className="px-6">
        <View className="bg-orange-100 rounded-2xl p-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="bulb-outline" size={20} color="#f97316" />
            <Text className="text-orange-700 font-bold ml-2">Pro Tip</Text>
          </View>
          <Text className="text-gray-700 text-sm">
            Did you know? The best chefs recommend writing down your recipe immediately after cooking while the details are still fresh in your mind.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
