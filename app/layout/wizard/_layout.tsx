import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

/**
 * Wizard Stack Layout Component
 * 
 * Defines the navigation structure for wizard-related screens including:
 * - AI Chat Interface
 * - Recipe Creation Wizard
 * - Import Flows
 * 
 * Uses a stack navigator with consistent styling and transitions
 * optimized for the wizard section user flow.
 * 
 * @returns JSX.Element - The wizard stack layout
 */
export default function WizardLayout() {
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
        {/* AI Chat Screen */}
        <Stack.Screen 
          name="chat" 
          options={{
            title: "AI Chef Chat",
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </>
  );
}