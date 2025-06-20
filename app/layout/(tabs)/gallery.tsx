import { View, Text, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import CreateCollectionModal from '@/components/collections/CreateCollectionModal';

// Define interfaces for our collection types
interface Collection {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  recipeCount: number;
  tags?: string[];
  isDefault?: boolean;
}

export default function Gallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: 0,
      title: "My Bookmarks",
      description: "All your bookmarked recipes in one place",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
      recipeCount: 24,
      tags: ['Bookmarks'],
      isDefault: true
    },
    {
      id: 1,
      title: "Breakfast Favorites",
      description: "Start your day with these delicious recipes",
      imageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666",
      recipeCount: 12,
      tags: ['Breakfast', 'Quick']
    },
    {
      id: 2,
      title: "Quick & Easy",
      description: "Perfect for busy weeknight dinners",
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
      recipeCount: 8,
      tags: ['Quick', 'Dinner']
    },
    {
      id: 3,
      title: "Healthy Options",
      description: "Nutritious and delicious meals",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      recipeCount: 15,
      tags: ['Healthy', 'Vegetarian']
    },
    {
      id: 4,
      title: "Desserts",
      description: "Sweet treats for any occasion",
      imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
      recipeCount: 10,
      tags: ['Dessert', 'Baking']
    },
    {
      id: 5,
      title: "Italian Classics",
      description: "Authentic Italian recipes",
      imageUrl: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85",
      recipeCount: 7,
      tags: ['Italian', 'Dinner']
    },
    {
      id: 6,
      title: "Vegan Delights",
      description: "Plant-based recipes everyone will love",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      recipeCount: 9,
      tags: ['Vegan', 'Healthy']
    }
  ]);
  
  const filters = ['All', 'Bookmarks', 'Breakfast', 'Dinner', 'Healthy', 'Quick', 'Dessert', 'Vegetarian'];
  
  const handleCreateCollection = (title: string, description: string, tags: string[]) => {
    const newCollection: Collection = {
      id: Math.max(...collections.map(c => c.id)) + 1,
      title,
      description: description || 'Custom collection',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
      recipeCount: 0,
      tags
    };
    
    setCollections([...collections, newCollection]);
    setShowCreateModal(false);
  };
  
  const filteredCollections = collections.filter(collection => {
    // Apply search filter
    const matchesSearch = searchQuery === '' || 
      collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply tag filter
    const matchesTag = activeFilter === 'All' || 
      collection.tags?.includes(activeFilter);
    
    return matchesSearch && matchesTag;
  });

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(300)} className="px-4 pt-4 pb-2">
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-3xl font-bold text-gray-900 mb-1">
              Gallery
            </Text>
            <Text className="text-gray-600 text-base">
              {collections.length} recipe collections
            </Text>
          </View>
          <Pressable 
            className="bg-orange-500 rounded-full px-4 py-2.5 flex-row items-center"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowCreateModal(true);
            }}
          >
            <Ionicons name="add" size={18} color="white" />
            <Text className="text-white font-medium ml-1">Create</Text>
          </Pressable>
        </View>
        
        {/* Search Bar */}
        <Animated.View 
          entering={FadeInDown.duration(400).delay(100)}
          className="bg-white rounded-xl flex-row items-center px-3 py-2.5 mt-2 mb-3 border border-gray-200"
        >
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 text-base text-gray-800 ml-2"
            placeholder="Search collections..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </Pressable>
          )}
        </Animated.View>
        
        {/* Filters */}
        <Animated.View 
          entering={FadeInDown.duration(500).delay(200)}
          className="mb-4"
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="-mx-1"
          >
            {filters.map((filter, index) => (
              <Pressable 
                key={filter}
                className={`mx-1 px-4 py-2 rounded-full ${activeFilter === filter ? 'bg-orange-500' : 'bg-white border border-gray-200'}`}
                onPress={() => setActiveFilter(filter)}
              >
                <Text 
                  className={`font-medium ${activeFilter === filter ? 'text-white' : 'text-gray-700'}`}
                >
                  {filter}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>
      </Animated.View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-4 pb-6">        
          {filteredCollections.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Ionicons name="search" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-lg mt-4 text-center">
                No collections found for "{searchQuery}"
              </Text>
              <Text className="text-gray-500 text-base mt-1 text-center">
                Try a different search term or filter
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap -mx-2">
              {filteredCollections.map((collection, index) => (
                <Animated.View 
                  key={collection.id}
                  entering={FadeInUp.duration(400).delay(100 + index * 50)}
                  className="w-1/2 px-2 mb-4"
                >
                  <Pressable 
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                    onPress={() => {/* Handle navigation */}}
                  >
                    <View className="relative">
                      <Image
                        source={{ uri: collection.imageUrl }}
                        className="w-full h-32"
                        resizeMode="cover"
                      />
                      {collection.isDefault && (
                        <View className="absolute top-2 right-2 bg-orange-500 rounded-full p-1.5">
                          <Ionicons name="bookmark" size={18} color="white" />
                        </View>
                      )}
                    </View>
                    <View className="p-3 min-h-[120px] justify-between">
                      <View>
                        <Text className="font-bold text-base text-gray-900 mb-1" numberOfLines={1}>
                          {collection.title}
                        </Text>
                        <View className="min-h-[32px] justify-start">
                          <Text className="text-gray-600 text-xs leading-4" numberOfLines={2} ellipsizeMode="tail">
                            {collection.description}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center justify-between mt-3">
                        <View className="flex-row items-center">
                          <MaterialIcons name="restaurant" size={14} color="#9CA3AF" />
                          <Text className="text-gray-500 text-xs ml-1">
                            {collection.recipeCount} recipes
                          </Text>
                        </View>
                        <View className="flex-row">
                          {collection.tags?.slice(0, 1).map(tag => (
                            <View key={tag} className="bg-orange-100 rounded-full px-2 py-0.5">
                              <Text className="text-orange-800 text-xs">{tag}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Create Collection Modal */}
      <CreateCollectionModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateCollection={handleCreateCollection}
      />
    </SafeAreaView>
  )
}