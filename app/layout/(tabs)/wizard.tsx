import { SafeAreaView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function Wizard() {
  return (
    <SafeAreaView className="flex flex-1 items-center bg-background">
      <Text className="text-4xl font-bold mt-7">Recipe Wizard</Text>
      <Text className="text-lg font-normal mt-2 mb-4">Time to cook something special ?</Text>

      <View className="w-full px-4 pb-4 flex-1 gap-4">
        <View className="shadow-lg flex-1">
          <TouchableOpacity
            className="bg-background dark:bg-muted/50 p-8 rounded-3xl h-full
                border-0 items-center justify-center
                active:opacity-90 shadow-2xl shadow-primary/30 dark:shadow-primary-dark/40"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            activeOpacity={0.9}
          >
            <Ionicons name="create" size={32} className="text-primary mb-4" />
            <Text className="text-xl font-semibold text-foreground mb-2">Create New Recipe</Text>
            <Text className="text-muted-foreground text-center">Start from scratch with our step-by-step builder</Text>
          </TouchableOpacity>
        </View>

        <View className="shadow-lg flex-1">
          <TouchableOpacity
            className="bg-background dark:bg-muted/50 p-8 rounded-3xl h-full
                border-0 items-center justify-center
                active:opacity-90 shadow-2xl shadow-primary/30 dark:shadow-primary-dark/40"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.9}
          >
            <Ionicons name="download" size={32} className="text-primary mb-4" />
            <Text className="text-xl font-semibold text-foreground mb-2">Import Recipe</Text>
            <Text className="text-muted-foreground text-center">Bring in recipes from other platforms or files</Text>
          </TouchableOpacity>
        </View>

        <View className="shadow-lg flex-1">
          <TouchableOpacity
            className="bg-background dark:bg-muted/50 p-8 rounded-3xl h-full
                border-0 items-center justify-center
                active:opacity-90 shadow-2xl shadow-primary/30 dark:shadow-primary-dark/40"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
            activeOpacity={0.9}
          >
            <Ionicons name="camera" size={32} className="text-primary mb-4" />
            <Text className="text-xl font-semibold text-foreground mb-2">Import from Photo</Text>
            <Text className="text-muted-foreground text-center">Scan recipes from photos or images</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
