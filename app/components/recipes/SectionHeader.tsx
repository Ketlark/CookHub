import { Text } from "@/components/ui/text";
import { View } from "react-native";

export function SectionHeader({ title }: { title: string }) {
  return (
    <View className="flex-row justify-between items-center px-6 mb-4">
      <Text className="text-2xl font-bold text-foreground">{title}</Text>
    </View>
  );
}
