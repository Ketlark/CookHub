import { cn } from "@/lib/utils";
import { TextRef } from "@rn-primitives/types";
import React from "react";
import { Text, TextProps } from "react-native";

const HeaderText = React.forwardRef<TextRef, TextProps>(({ className, ...props }, ref) => (
  <Text ref={ref} className={cn("ml-6 text-2xl font-semibold text-card-foreground", className)} {...props} />
));

HeaderText.displayName = "HeaderText";
export { HeaderText };
