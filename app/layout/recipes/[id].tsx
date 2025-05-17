import { Text } from "@/components/ui/text";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";

export default function Recipe() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Recette " + id,
    });
  });

  return (
    <SafeAreaView>
      <Text>Recipe {id}</Text>
    </SafeAreaView>
  );
}
