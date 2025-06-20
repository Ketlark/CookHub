import { Tabs } from "expo-router";
import { View, Image, Text } from "react-native";
import { ImageSourcePropType } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabIconProps = {
  source: ImageSourcePropType;
  label: string;
  focused: boolean;
};

const TabIcon = ({ source, label, focused }: TabIconProps) => (
  <View className="flex-1 w-16 items-center">
    <Image source={source} style={{ width: 34, height: 34 }} alt={`${label} tab icon`} />
    <Text className={`text-xs ${focused ? "font-extrabold" : "font-medium"} ${focused ? "text-foreground" : "text-foreground/70"}`} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const commonTabOptions = {
  headerShown: false,
  tabBarShowLabel: false,
};

const tabs = [
  { name: "index", label: "Feed", icon: require("../../assets/tabs/home_icon.png") },
  { name: "search", label: "Explore", icon: require("../../assets/tabs/explore_icon.png") },
  { name: "wizard", label: "Cook Up", icon: require("../../assets/tabs/wizard_icon.png") },
  { name: "gallery", label: "Gallery", icon: require("../../assets/tabs/gallery_icon.png") },
  { name: "profile", label: "Profile", icon: require("../../assets/tabs/profile_icon.png") },
] as const;

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      {tabs.map(({ name, label, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            ...commonTabOptions,
            tabBarIcon: ({ focused }) => <TabIcon source={icon} label={label} focused={focused} />,
            tabBarStyle: {
              height: insets.bottom + 60,
            },
          }}
        />
      ))}
    </Tabs>
  );
}
