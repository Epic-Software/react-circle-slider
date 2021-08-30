import { StyleProp, ViewStyle } from "react-native";

export interface CircleProps {
  min?: number;
  max?: number;
  value?: number;
  xCenter?: number;
  yCenter?: number;
  textSize?: number;
  btnRadius?: number;
  dialWidth?: number;
  textColor?: string;
  fillColor?: string;
  dialRadius?: number;
  meterColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  onChange?: (angle: number) => void;
}
