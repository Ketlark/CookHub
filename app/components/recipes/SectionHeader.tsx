import { Text } from "@/components/ui/text";
import { View } from "react-native";

export function SectionHeader({ title }: { title: string }) {
  return (
    <View className="flex-row justify-between items-center px-6 mb-2">
      <Text className="text-xl font-bold text-foreground">{title}</Text>
    </View>
  );
}
