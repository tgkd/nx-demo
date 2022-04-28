import React, { PropsWithChildren } from 'react';
import { View, TouchableWithoutFeedback, ViewStyle } from 'react-native';

export interface ButtonProps {
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
}

export function Button(props: PropsWithChildren<ButtonProps>) {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={props.style}>{props.children}</View>
    </TouchableWithoutFeedback>
  );
}

export default Button;
