import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabPage({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView>
      <View className="flex-1 bg-orange-100">{children}</View>
    </SafeAreaView>
  );
}
