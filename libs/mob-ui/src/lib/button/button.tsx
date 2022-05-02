import React, { PropsWithChildren } from 'react';
import {
  TouchableWithoutFeedback,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface ButtonProps {
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
}

const PRESS_SCALE = 0.95;

export function Button(props: PropsWithChildren<ButtonProps>) {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withTiming(PRESS_SCALE);
  };

  const onPressOut = () => {
    scale.value = withTiming(1);
  };

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
    }),
    [scale]
  );

  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={[animatedStyle, styles.container, props.style]}>
        {props.children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export default Button;

const styles = StyleSheet.create({
  container: {},
});
