import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

/**
 * Profile Stack Layout Component
 * 
 * Defines the navigation structure for profile-related screens including:
 * - Edit Profile
 * - Notifications Settings
 * - Privacy & Security
 * - Help & Support
 * - About
 * - Settings
 * 
 * Uses a stack navigator with consistent styling and transitions
 * optimized for the profile section user flow.
 * 
 * @returns JSX.Element - The profile stack layout
 */
export default function ProfileLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#fff7ed" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        {/* Edit Profile Screen */}
        <Stack.Screen 
          name="edit" 
          options={{
            title: "Edit Profile",
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        
        {/* Notifications Settings Screen */}
        <Stack.Screen 
          name="notifications" 
          options={{
            title: "Notifications",
          }}
        />
        
        {/* Privacy & Security Settings Screen */}
        <Stack.Screen 
          name="privacy" 
          options={{
            title: "Privacy & Security",
          }}
        />
        
        {/* Help & Support Screen */}
        <Stack.Screen 
          name="help" 
          options={{
            title: "Help & Support",
          }}
        />
        
        {/* About Screen */}
        <Stack.Screen 
          name="about" 
          options={{
            title: "About CookHub",
          }}
        />
        
        {/* Settings Screen */}
        <Stack.Screen 
          name="settings" 
          options={{
            title: "Settings",
          }}
        />
      </Stack>
    </>
  );
}