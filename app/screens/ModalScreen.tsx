import { View, Text, TouchableOpacity } from 'react-native';

export default function ModalScreen({ navigation }) {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100/50">
      <View className="bg-white rounded-2xl p-8 w-4/5 shadow-xl">
        <Text className="text-lg font-semibold mb-4">Nouvel élément</Text>
        {/* Contenu */}
        <TouchableOpacity 
          className="mt-4 bg-blue-500 p-3 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white text-center">Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}