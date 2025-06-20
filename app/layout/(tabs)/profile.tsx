import { View, Text, ScrollView, Image, Pressable, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useState } from "react";
import { router } from "expo-router";
// Define interfaces for user data
interface UserStats {
  recipesCreated: number;
  collectionsCount: number;
  totalCookingTime: number;
  bookmarkedRecipes: number;
  averageRating: number;
  recipesRated: number;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
}

export default function Profile() {
  const { width } = useWindowDimensions();
  const [user] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    joinDate: "March 2024",
    location: "San Francisco, CA",
    bio: "Passionate home cook who loves experimenting with flavors from around the world. Always looking for new recipes to try!",
  });

  const [stats] = useState<UserStats>({
    recipesCreated: 24,
    collectionsCount: 8,
    totalCookingTime: 156,
    bookmarkedRecipes: 42,
    averageRating: 4.3,
    recipesRated: 18,
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "Recipe Creator",
      description: "Created your first recipe",
      icon: "restaurant",
      earned: true,
    },
    {
      id: 2,
      title: "Collection Master",
      description: "Created 5 collections",
      icon: "bookmark",
      earned: true,
    },
    {
      id: 3,
      title: "Cooking Streak",
      description: "Cooked for 7 days straight",
      icon: "local-fire-department",
      earned: false,
      progress: 4,
    },
    {
      id: 4,
      title: "Social Chef",
      description: "Shared 10 recipes",
      icon: "share",
      earned: false,
      progress: 6,
    },
  ]);

  const menuItems = [
    { icon: "edit", title: "Edit Profile", subtitle: "Update your information", route: "/profile/edit" },
    { icon: "notifications", title: "Notifications", subtitle: "Manage your preferences", route: "/profile/notifications" },
    { icon: "security", title: "Privacy & Security", subtitle: "Account settings", route: "/profile/privacy" },
    { icon: "help", title: "Help & Support", subtitle: "Get assistance", route: "/profile/help" },
    { icon: "info", title: "About", subtitle: "App information", route: "/profile/about" },
    { icon: "settings", title: "Settings", subtitle: "App preferences", route: "/profile/settings" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-orange-50" edges={['top', 'left', 'right']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header with Avatar */}
        <Animated.View entering={FadeInDown.duration(300)} className="px-4 pt-4 pb-6">
          <View className="items-center">
            <View className="relative mb-4">
              <Image source={{ uri: user.avatar }} className="w-24 h-24 rounded-full" resizeMode="cover" />
              <Pressable className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-2" onPress={() => router.push("/profile/edit")}>
                <MaterialIcons name="edit" size={16} color="white" />
              </Pressable>
            </View>

            <Text className="text-2xl font-bold text-gray-900 mb-1">{user.name}</Text>
            <Text className="text-gray-600 text-base mb-2">{user.email}</Text>
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="location-on" size={16} color="#9CA3AF" />
              <Text className="text-gray-500 text-sm ml-1">{user.location}</Text>
            </View>
            <Text className="text-gray-700 text-center text-sm leading-5 px-4">{user.bio}</Text>
          </View>
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} className="px-4 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Your Stats</Text>
          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
                <View className="flex-row items-center justify-between mb-2">
                  <MaterialIcons name="restaurant" size={24} color="#ea580c" />
                  <Text className="text-2xl font-bold text-gray-900">{stats.recipesCreated}</Text>
                </View>
                <Text className="text-gray-600 text-sm">Recipes Created</Text>
              </View>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <View className="bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
                <View className="flex-row items-center justify-between mb-2">
                  <MaterialIcons name="collections-bookmark" size={24} color="#ea580c" />
                  <Text className="text-2xl font-bold text-gray-900">{stats.collectionsCount}</Text>
                </View>
                <Text className="text-gray-600 text-sm">Collections</Text>
              </View>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <View className="bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
                <View className="flex-row items-center justify-between mb-2">
                  <MaterialIcons name="schedule" size={24} color="#ea580c" />
                  <Text className="text-2xl font-bold text-gray-900">{stats.totalCookingTime}h</Text>
                </View>
                <Text className="text-gray-600 text-sm">Cooking Time</Text>
              </View>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <View className="bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
                <View className="flex-row items-center justify-between mb-2">
                  <MaterialIcons name="bookmark" size={24} color="#ea580c" />
                  <Text className="text-2xl font-bold text-gray-900">{stats.bookmarkedRecipes}</Text>
                </View>
                <Text className="text-gray-600 text-sm">Bookmarked</Text>
              </View>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <View className="bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
                <View className="flex-row items-center justify-between mb-2">
                  <MaterialIcons name="star" size={24} color="#ea580c" />
                  <Text className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</Text>
                </View>
                <Text className="text-gray-600 text-sm">Avg Rating</Text>
              </View>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <View className="bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
                <View className="flex-row items-center justify-between mb-2">
                  <MaterialIcons name="rate-review" size={24} color="#ea580c" />
                  <Text className="text-2xl font-bold text-gray-900">{stats.recipesRated}</Text>
                </View>
                <Text className="text-gray-600 text-sm">Recipes Rated</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Achievements */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)} className="px-4 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Achievements</Text>
          <View className="flex-row flex-wrap -mx-2">
            {achievements.map((achievement, index) => (
              <View key={achievement.id} className="w-1/2 px-2 mb-4">
                <View
                  className={`rounded-xl p-4 border shadow-sm ${achievement.earned ? "bg-orange-50 border-orange-200" : "bg-white border-gray-200"}`}
                >
                  <View className="items-center">
                    <View
                      className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${achievement.earned ? "bg-orange-500" : "bg-gray-300"}`}
                    >
                      <MaterialIcons name={achievement.icon as any} size={24} color="white" />
                    </View>
                    <Text className={`font-bold text-sm text-center mb-1 ${achievement.earned ? "text-orange-900" : "text-gray-700"}`}>
                      {achievement.title}
                    </Text>
                    <Text className="text-xs text-gray-600 text-center">{achievement.description}</Text>
                    {!achievement.earned && achievement.progress && (
                      <View className="w-full mt-2">
                        <View className="bg-gray-200 rounded-full h-1.5">
                          <View className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(achievement.progress / 10) * 100}%` }} />
                        </View>
                        <Text className="text-xs text-gray-500 text-center mt-1">{achievement.progress}/10</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Settings Menu */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} className="px-4 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Settings</Text>
          <View className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-hidden">
            {menuItems.map((item, index) => (
              <Pressable
                key={item.title}
                className={`flex-row items-center p-4 ${index !== menuItems.length - 1 ? "border-b border-gray-100" : ""}`}
                onPress={() => router.push(item.route as any)}
              >
                <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                  <MaterialIcons name={item.icon as any} size={20} color="#ea580c" />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-900 text-base">{item.title}</Text>
                  <Text className="text-gray-500 text-sm">{item.subtitle}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.duration(700).delay(400)} className="px-4 pb-8">
          <Pressable
            className="bg-red-500 rounded-xl p-4 flex-row items-center justify-center"
            onPress={() => {
              /* Handle logout */
            }}
          >
            <MaterialIcons name="logout" size={20} color="white" />
            <Text className="text-white font-medium text-base ml-2">Sign Out</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
