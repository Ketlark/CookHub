import { useState } from 'react';
import { View, TextInput, Image, ScrollView, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native-gesture-handler';
import DragList, { DragListRenderItemInfo } from 'react-native-draglist';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';

interface Ingredient {
  id: string;
  text: string;
}

interface CookingStep {
  id: string;
  text: string;
  image: string | null;
}

export default function CreateRecipe() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState('Medium');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: '1', text: '' }]);
  const [cookingSteps, setCookingSteps] = useState<CookingStep[]>([{ id: '1', text: '', image: null }]);


  const ANIMATION_FADE_IN_TIME = 200

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  };

  const pickStepImage = async (stepId: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCookingSteps(prev => prev.map(step => 
        step.id === stepId ? { ...step, image: result.assets[0].uri } : step
      ));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const addIngredient = () => {
    const newId = Date.now().toString();
    setIngredients(prev => [...prev, { id: newId, text: '' }]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(prev => prev.filter(item => item.id !== id));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const updateIngredient = (id: string, text: string) => {
    setIngredients(prev => prev.map(item => 
      item.id === id ? { ...item, text } : item
    ));
  };

  const addCookingStep = () => {
    const newId = Date.now().toString();
    setCookingSteps(prev => [...prev, { id: newId, text: '', image: null }]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removeCookingStep = (id: string) => {
    if (cookingSteps.length > 1) {
      setCookingSteps(prev => prev.filter(step => step.id !== id));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const updateCookingStep = (id: string, text: string) => {
    setCookingSteps(prev => prev.map(step => 
      step.id === id ? { ...step, text } : step
    ));
  };

  const onReorderIngredients = (fromIndex: number, toIndex: number) => {
    const newIngredients = [...ingredients];
    const [removed] = newIngredients.splice(fromIndex, 1);
    newIngredients.splice(toIndex, 0, removed);
    setIngredients(newIngredients);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onReorderSteps = (fromIndex: number, toIndex: number) => {
    const newSteps = [...cookingSteps];
    const [removed] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, removed);
    setCookingSteps(newSteps);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!title.trim()) {
        Alert.alert('Missing Information', 'Please enter a recipe title.');
        return false;
      }
      if (!description.trim()) {
        Alert.alert('Missing Information', 'Please enter a recipe description.');
        return false;
      }
    } else if (step === 2) {
      const validIngredients = ingredients.filter(ing => ing.text.trim());
      if (validIngredients.length === 0) {
        Alert.alert('Missing Information', 'Please add at least one ingredient.');
        return false;
      }
    } else if (step === 3) {
      const validSteps = cookingSteps.filter(step => step.text.trim());
      if (validSteps.length === 0) {
        Alert.alert('Missing Information', 'Please add at least one cooking step.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 3) {
        setStep(step + 1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    // Here you would typically save the recipe
    Alert.alert(
      'Recipe Created!', 
      'Your recipe has been successfully created.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  const renderStep1 = () => (
    <Animated.View 
      entering={FadeIn.duration(ANIMATION_FADE_IN_TIME)}
      className="flex-1"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Cover Image Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(ANIMATION_FADE_IN_TIME)}>
          <Text className="text-xl font-bold text-gray-800 mb-4">Cover Photo</Text>
          <Pressable 
            onPress={pickImage}
            style={{
              width: '100%',
              height: 192,
              borderRadius: 16,
              marginBottom: 24,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: coverImage ? '#f3f4f6' : '#fff7ed',
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: coverImage ? '#d1d5db' : '#fb923c',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {coverImage ? (
              <>
                <Image 
                  source={{ uri: coverImage }} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute inset-0 bg-black/30 items-center justify-center">
                  <View className="bg-white/95 px-4 py-2 rounded-xl flex-row items-center">
                    <Ionicons name="camera-outline" size={18} color="#374151" />
                    <Text className="text-gray-800 font-semibold text-sm ml-2">Tap to change photo</Text>
                  </View>
                </View>
              </>
            ) : (
              <View className="items-center">
                <View className="w-32 h-20 bg-orange-100 rounded-2xl items-center justify-center mt-4 mb-1">
                  <Ionicons name="image-outline" size={32} color="#ea580c" />
                </View>
                <Text className="text-orange-600 font-bold text-lg">Add Cover Photo</Text>
                <Text className="text-orange-400 text-xs text-center px-4 mb-4">Tap to select a beautiful photo for your recipe</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>

        {/* Recipe Details */}
        <View className="space-y-6">
          <Animated.View entering={FadeInDown.delay(200).duration(ANIMATION_FADE_IN_TIME)}>
            <Text className="text-xl font-bold text-gray-800 my-5">Recipe Details</Text>
            
            <View className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 mb-2">
              <Text className="text-gray-700 font-semibold mb-3">Recipe Title *</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Grandma's Chocolate Chip Cookies"
                placeholderTextColor="#9ca3af"
                className="text-base text-gray-800 pb-2 border-b border-gray-200"
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(ANIMATION_FADE_IN_TIME)}>
            <View className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100">
              <Text className="text-gray-700 font-semibold mb-3">Description *</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Tell us what makes this recipe special..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                className="text-base text-gray-800 min-h-[80px]"
                textAlignVertical="top"
              />
            </View>
          </Animated.View>

          {/* Recipe Metrics */}
          <Animated.View entering={FadeInDown.delay(400).duration(ANIMATION_FADE_IN_TIME)}>
            <Text className="text-xl font-bold text-gray-800 my-5">Recipe Info</Text>
            
            <View className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 space-y-6">
              {/* Cooking Time */}
              <View>
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-gray-700 font-semibold">Cooking Time</Text>
                  <View className="bg-orange-100 px-3 py-1 rounded-full">
                    <Text className="text-orange-600 font-bold">{duration} min</Text>
                  </View>
                </View>
                <Slider
                  value={duration}
                  onValueChange={setDuration}
                  minimumValue={5}
                  maximumValue={180}
                  step={5}
                  minimumTrackTintColor="#ea580c"
                  maximumTrackTintColor="#fed7aa"
                  thumbTintColor="#ea580c"
                  style={{ height: 40 }}
                />
                <View className="flex-row justify-between mt-1">
                  <Text className="text-xs text-gray-500">5 min</Text>
                  <Text className="text-xs text-gray-500">3 hours</Text>
                </View>
              </View>

              {/* Servings */}
              <View>
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-gray-700 font-semibold">Servings</Text>
                  <View className="bg-orange-100 px-3 py-1 rounded-full">
                    <Text className="text-orange-600 font-bold">{servings} people</Text>
                  </View>
                </View>
                <Slider
                  value={servings}
                  onValueChange={setServings}
                  minimumValue={1}
                  maximumValue={12}
                  step={1}
                  minimumTrackTintColor="#ea580c"
                  maximumTrackTintColor="#fed7aa"
                  thumbTintColor="#ea580c"
                  style={{ height: 40 }}
                />
                <View className="flex-row justify-between mt-1">
                  <Text className="text-xs text-gray-500">1 person</Text>
                  <Text className="text-xs text-gray-500">12 people</Text>
                </View>
              </View>

              {/* Difficulty */}
              <View className="py-6 border-b border-orange-100">
              <Text className="text-lg font-semibold text-gray-900 mb-4">Difficulty Level</Text>
                <View className="flex-row gap-3">
                  {difficultyOptions.map((level, index) => {
                    const isActive = difficulty === level;
                    return (
                      <Pressable
                        key={index}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setDifficulty(level);
                        }}
                        style={{
                          flex: 1,
                          paddingVertical: 12,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: isActive ? '#ea580c' : '#fed7aa',
                          backgroundColor: isActive ? '#ea580c' : '#fff',
                          alignItems: 'center',
                          marginRight: index !== difficultyOptions.length - 1 ? 12 : 0,
                        }}
                      >
                        <Text 
                          className={`text-center text-base ${
                            difficulty === level ? 'text-white' : 'text-gray-700'
                          }`}
                        >
                          {level}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
        
        <View className="h-8" />
      </ScrollView>
    </Animated.View>
  );

  const renderIngredientItem = ({ item, index, onDragStart, onDragEnd, isActive }: DragListRenderItemInfo<Ingredient>) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 50).duration(ANIMATION_FADE_IN_TIME)}
      className="mb-4"
    >
      <View 
        className={`m-1 bg-white rounded-2xl shadow-sm border overflow-hidden ${
          isActive ? 'border-orange-300 shadow-lg' : 'border-orange-100'
        }`}
        style={{
          transform: [{ scale: isActive ? 1.02 : 1 }],
          shadowColor: isActive ? '#ea580c' : '#000',
          shadowOpacity: isActive ? 0.2 : 0.1,
        }}
      >
        <View className="flex-row">
          {/* Drag Handle */}
          <Pressable
            onLongPress={onDragStart}
            onPressOut={onDragEnd}
            delayLongPress={100}
            style={{
              width: 48,
              backgroundColor: '#fff7ed',
              borderRightWidth: 1,
              borderRightColor: '#fed7aa',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="reorder-three-outline" size={20} color="#ea580c" />
          </Pressable>
          
          {/* Input Field */}
          <View className="flex-1 px-3 py-3 justify-center">
            <TextInput
              value={item.text}
              onChangeText={(text) => updateIngredient(item.id, text)}
              placeholder={`Ingredient ${index + 1} (e.g., 2 cups flour)`}
              placeholderTextColor="#9ca3af"
              className="text-lg text-gray-800"
              multiline
              style={{
                textAlignVertical: 'center',
                padding: 0,
                margin: 0,
                minHeight: 28,
              }}
            />
          </View>
          
          {/* Delete Button */}
          {ingredients.length > 1 && (
            <Pressable
              onPress={() => removeIngredient(item.id)}
              style={{
                width: 48,
                borderLeftWidth: 1,
                borderLeftColor: '#fed7aa',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </Pressable>
          )}
        </View>
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View 
      entering={FadeIn.duration(ANIMATION_FADE_IN_TIME)}
      className="flex-1"
    >
      <Animated.View entering={FadeInUp.delay(100).duration(ANIMATION_FADE_IN_TIME)}>
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-800">Ingredients</Text>
            <Text className="text-gray-500 mt-1">Drag to reorder • Swipe to delete</Text>
          </View>
          <View className="bg-orange-100 px-3 py-2 rounded-full">
            <Text className="text-orange-600 font-bold text-sm">{ingredients.length} items</Text>
          </View>
        </View>
      </Animated.View>
      
      <View className="flex-1">
        <DragList
          data={ingredients}
          renderItem={renderIngredientItem}
          keyExtractor={(item) => item.id}
          onReordered={onReorderIngredients}
          containerStyle={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        />
        
        <Animated.View>
          <Pressable
            onPress={addIngredient}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f97316',
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 24,
              marginTop: 16,
              shadowColor: '#ea580c',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                marginLeft: 12,
                fontSize: 16,
              }}
            >
              Add Ingredient
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const renderCookingStepItem = ({ item, index, onDragStart, onDragEnd, isActive }: DragListRenderItemInfo<CookingStep>) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 50).duration(ANIMATION_FADE_IN_TIME)}
      className="mb-6"
    >
      <View 
        className={`m-1 bg-white rounded-2xl shadow-sm border overflow-hidden ${
          isActive ? 'border-orange-600 shadow-lg' : 'border-orange-200'
        }`}
        style={{
          transform: [{ scale: isActive ? 1.02 : 1 }],
          shadowColor: isActive ? '#ea580c' : '#000',
          shadowOpacity: isActive ? 0.2 : 0.1,
        }}
      >
        {/* Header with drag handle and step number */}
        <View className="flex-row items-center bg-orange-50 border-b border-orange-100">
          <Pressable
            onLongPress={onDragStart}
            onPressOut={onDragEnd}
            delayLongPress={100}
            style={{
              width: 48,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 16,
              borderRightWidth: 1,
              borderRightColor: '#fed7aa',
            }}
          >
            <Ionicons name="reorder-three-outline" size={20} color="#ea580c" />
          </Pressable>
          
          <View className="flex-1 px-4 py-3 flex-row items-center">
            <View className="w-6 h-6 bg-orange-500 rounded-full items-center justify-center mr-3">
              <Text className="text-white font-bold text-xs">{index + 1}</Text>
            </View>
            <Text className="text-orange-600 font-bold text-base">Step {index + 1}</Text>
          </View>
          
          <Pressable
            onPress={() => pickStepImage(item.id)}
            style={{
              width: 48,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 16,
              backgroundColor: '#fef2f2',
            }}
            hitSlop={8}
          >
            <Ionicons name="camera-outline" size={20} color="#ea580c" />
          </Pressable>
          
          {cookingSteps.length > 1 && (
            <Pressable
              onPress={() => removeCookingStep(item.id)}
              style={{
                padding: 16,
                backgroundColor: '#fef2f2',
              }}
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </Pressable>
          )}
        </View>
        
        {/* Step image if exists */}
        {item.image && (
          <View className="relative">
            <Image 
              source={{ uri: item.image }} 
              className="w-full h-48"
              resizeMode="cover"
            />
            <View className="absolute top-3 right-3 bg-black/50 rounded-full p-2">
              <Ionicons name="image" size={16} color="white" />
            </View>
          </View>
        )}
        
        {/* Step description */}
        <View className="p-4">
          <TextInput
            value={item.text}
            onChangeText={(text) => updateCookingStep(item.id, text)}
            placeholder="Describe this step in detail... (e.g., Heat oil in a large pan over medium heat)"
            placeholderTextColor="#9ca3af"
            className="text-base text-gray-800 min-h-[80px]"
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View 
      entering={FadeIn.duration(ANIMATION_FADE_IN_TIME)}
      className="flex-1"
    >
      <Animated.View entering={FadeInUp.delay(100).duration(ANIMATION_FADE_IN_TIME)}>
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-800">Instructions</Text>
            <Text className="text-gray-500 mt-1">Drag to reorder • Add photos to steps</Text>
          </View>
          <View className="bg-orange-100 px-3 py-2 rounded-full">
            <Text className="text-orange-600 font-bold text-sm">{cookingSteps.length} steps</Text>
          </View>
        </View>
      </Animated.View>
      
      <View className="flex-1">
        <DragList
          data={cookingSteps}
          renderItem={renderCookingStepItem}
          keyExtractor={(item) => item.id}
          onReordered={onReorderSteps}
          containerStyle={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        />
        
        <Animated.View>
          <Pressable
            onPress={addCookingStep}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f97316',
              borderRadius: 16,
              padding: 16,
              marginTop: 16,
              shadowColor: '#ea580c',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text className="text-white font-bold ml-3 text-lg">Add Step</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const progressSteps = [
    { label: 'Basic Info' },
    { label: 'Ingredients' },
    { label: 'Instructions' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-orange-50">      
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.duration(ANIMATION_FADE_IN_TIME)}
        className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-orange-100"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Pressable 
          onPress={() => router.back()}
          style={{
            padding: 8,
            marginLeft: -8,
          }}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </Pressable>
        
        <Text className="text-lg font-bold text-gray-800">Create Recipe</Text>
        
        <View className="w-8" />
      </Animated.View>

      {/* Progress Indicator */}
      <Animated.View 
        entering={FadeInDown.delay(100).duration(ANIMATION_FADE_IN_TIME)}
        className="px-6 py-5 bg-white"
      >
        <View className="flex-row justify-between items-end mb-2">
          {progressSteps.map((stepObj, index) => (
            <React.Fragment key={index}>
              <View className="items-center flex-1">
                <Animated.View 
                  entering={FadeInDown.delay((index + 1) * 100).duration(ANIMATION_FADE_IN_TIME)}
                  className={`w-10 h-10 rounded-full items-center justify-center border-2 ${
                    step > index + 1
                      ? 'bg-orange-300 border-orange-500'
                      : step === index + 1
                      ? 'bg-orange-200 border-orange-100'
                      : 'bg-gray-100 border-gray-200'
                  }`}
                >
                  {step > index + 1 ? (
                    <Ionicons name="checkmark" size={18} color="white" />
                  ) : (
                    <Text
                      className={`text-sm font-bold ${
                        step >= index + 1 ? 'text-orange-600' : 'text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </Text>
                  )}
                </Animated.View>
                <Text
                  className={`text-xs font-medium mt-2 ${
                    step >= index + 1 ? 'text-orange-600' : 'text-gray-500'
                  }`}
                  style={{ textAlign: 'center', width: 80 }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {stepObj.label}
                </Text>
              </View>
              {index < progressSteps.length - 1 && (
                <View
                  className={`h-1 flex-1 mx-1 rounded-full self-center ${
                    step > index + 1 ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                  style={{ minWidth: 12, maxWidth: 32 }}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </Animated.View>

      {/* Content */}
      <View className="flex-1 px-6 py-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </View>

      {/* Navigation Buttons */}
      <Animated.View 
        entering={FadeInUp.duration(ANIMATION_FADE_IN_TIME)}
        className="px-6 pt-4 pb-4 bg-white border-t border-orange-100"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Pressable
            onPress={step > 1 ? () => setStep(step - 1) : undefined}
            disabled={step === 1}
            style={{
              flex: 1,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: step === 1 ? '#d1d5db' : '#e5e7eb',
              backgroundColor: step === 1 ? '#f9fafb' : '#f3f4f6',
              paddingVertical: 8,
              paddingHorizontal: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: step === 1 ? 0.05 : 0.1,
              shadowRadius: 4,
              elevation: 3,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              opacity: step === 1 ? 0.5 : 1,
            }}
          >
            <Ionicons name="chevron-back" size={14} color={step === 1 ? '#9ca3af' : '#374151'} />
            <Text style={{ fontWeight: 'bold', color: step === 1 ? '#9ca3af' : '#374151', marginLeft: 4, fontSize: 14 }}>Previous</Text>
          </Pressable>
          
          <Pressable
            onPress={step === 3 ? handleSubmit : handleNext}
            style={{
              flex: 1,
              borderRadius: 10,
              backgroundColor: '#fdba74',
              paddingVertical: 8,
              paddingHorizontal: 12,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 14 }}>
              {step === 3 ? 'Create Recipe' : 'Next'}
            </Text>
            {step < 3 && (
              <Ionicons name="chevron-forward" size={14} color="white" style={{ marginLeft: 4 }} />
            )}
          </Pressable>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}