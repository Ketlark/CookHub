import { Modal, View, ScrollView, Pressable } from 'react-native';
import { Text } from "@/components/ui/text";
import { CategoryCard } from "@/components/recipes/CategoryCard";
import { Ionicons } from '@expo/vector-icons';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onCategorySelect: (categoryName: string) => void;
}

export default function CategoryModal({ visible, onClose, onCategorySelect }: CategoryModalProps) {
  const categories = {
    regions: [
      {name: "Asian", icon: "🥡"},
      {name: "Italian", icon: "🍝"},
      {name: "Mexican", icon: "🌮"},
      {name: "Indian", icon: "🍛"},
      {name: "French", icon: "🥐"},
      {name: "Mediterranean", icon: "🫒"},
      {name: "Middle Eastern", icon: "🧆"},
      {name: "American", icon: "🍔"}
    ],
    dietary: [
      {name: "Vegetarian", icon: "🥗"},
      {name: "Vegan", icon: "🌱"},
      {name: "Gluten Free", icon: "🌾"},
      {name: "Keto", icon: "🥑"},
      {name: "Low Carb", icon: "🥩"},
      {name: "Paleo", icon: "🍖"},
      {name: "Dairy Free", icon: "🥛"}
    ],
    mealType: [
      {name: "Breakfast", icon: "🍳"},
      {name: "Lunch", icon: "🥪"},
      {name: "Dinner", icon: "🍽️"},
      {name: "Desserts", icon: "🍰"},
      {name: "Snacks", icon: "🍿"},
      {name: "Drinks", icon: "🍹"}
    ],
    cookingMethod: [
      {name: "Grilling", icon: "🔥"},
      {name: "Baking", icon: "🥖"},
      {name: "Slow Cooking", icon: "🍲"},
      {name: "Air Fryer", icon: "♨️"},
      {name: "One Pot", icon: "🥘"},
      {name: "No Cook", icon: "🥬"}
    ]
  };

  const handleCategorySelect = (categoryName: string) => {
    onCategorySelect(categoryName);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-orange-50">
        {/* Header */}
        <View className="px-6 py-4 pt-6 border-b border-orange-100 bg-white shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">Categories</Text>
              <Text className="text-sm text-gray-500 mt-1 mb-2">
                Explore recipes by cuisine, diet, or cooking style
              </Text>
            </View>
            <Pressable 
              onPress={onClose}
              className="bg-orange-100 p-2 rounded-xl"
              hitSlop={8}
            >
              <Ionicons name="close" size={24} color="#ca3500" />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {Object.entries(categories).map(([category, items]) => (
            <View key={category} className="mb-10 mt-4">
              <Text className="text-2xl font-bold text-gray-800 mb-6 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </Text>
              <View className="flex-row flex-wrap justify-between">
                {items.map((item, index) => (
                  <View key={index} className='w-1/2 px-2'>
                    <CategoryCard
                      key={index}
                      name={item.name}
                      icon={item.icon}
                      onPress={() => handleCategorySelect(item.name)}
                      variant='full'
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}
          {/* Add some bottom padding for better scrolling experience */}
          <View className="h-8" />
        </ScrollView>
      </View>
    </Modal>
  );
}