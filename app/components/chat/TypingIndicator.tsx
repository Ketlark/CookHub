import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withDelay,
  withTiming,
  FadeInUp,
  FadeOutDown,
  SharedValue,
} from "react-native-reanimated";

interface TypingIndicatorProps {
  visible: boolean;
}

/**
 * TypingIndicator component showing animated dots when AI is typing
 * Features smooth fade in/out animations and bouncing dots
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ visible }) => {
  const dot1Opacity = useSharedValue(0.3);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);

  const dot1Scale = useSharedValue(1);
  const dot2Scale = useSharedValue(1);
  const dot3Scale = useSharedValue(1);

  const rotation = useSharedValue(0);
  const textOpacity = useSharedValue(0.5);

  useEffect(() => {
    if (visible) {
      // Start the typing animation
      const animateDot = (dotOpacity: SharedValue<number>, dotScale: SharedValue<number>, delay: number) => {
        dotOpacity.value = withRepeat(
          withSequence(withDelay(delay, withTiming(1, { duration: 400 })), withTiming(0.3, { duration: 400 })),
          -1,
          false,
        );

        dotScale.value = withRepeat(withSequence(withDelay(delay, withTiming(1.2, { duration: 400 })), withTiming(1, { duration: 400 })), -1, false);
      };

      animateDot(dot1Opacity, dot1Scale, 0);
      animateDot(dot2Opacity, dot2Scale, 200);
      animateDot(dot3Opacity, dot3Scale, 400);

      // Start rotation animation
      rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1, false);

      // Start text opacity animation
      textOpacity.value = withRepeat(withSequence(withTiming(0.5, { duration: 1000 }), withTiming(1, { duration: 1000 })), -1, true);
    } else {
      // Reset animations
      dot1Opacity.value = withTiming(0.3, { duration: 200 });
      dot2Opacity.value = withTiming(0.3, { duration: 200 });
      dot3Opacity.value = withTiming(0.3, { duration: 200 });

      dot1Scale.value = withTiming(1, { duration: 200 });
      dot2Scale.value = withTiming(1, { duration: 200 });
      dot3Scale.value = withTiming(1, { duration: 200 });

      rotation.value = withTiming(0, { duration: 200 });
      textOpacity.value = withTiming(0.5, { duration: 200 });
    }
  }, [visible, dot1Opacity, dot2Opacity, dot3Opacity, dot1Scale, dot2Scale, dot3Scale, rotation, textOpacity]);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
    transform: [{ scale: dot1Scale.value }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
    transform: [{ scale: dot2Scale.value }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
    transform: [{ scale: dot3Scale.value }],
  }));

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View entering={FadeInUp.springify()} exiting={FadeOutDown.springify()} className="mb-4 items-start">
      <View
        className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center space-x-1">
          <Animated.View style={[dot1Style]} className="w-2 h-2 bg-gray-400 rounded-full" />
          <Animated.View style={[dot2Style]} className="w-2 h-2 bg-gray-400 rounded-full" />
          <Animated.View style={[dot3Style]} className="w-2 h-2 bg-gray-400 rounded-full" />
        </View>
      </View>

      {/* AI Chef Indicator */}
      <View className="flex-row items-center mt-1">
        <View className="bg-orange-100 rounded-full p-1 mr-2">
          <Animated.View className="w-3 h-3 bg-orange-500 rounded-full" style={rotationStyle} />
        </View>
        <Animated.Text className="text-xs text-gray-400" style={textStyle}>
          AI Chef is thinking...
        </Animated.Text>
      </View>
    </Animated.View>
  );
};
