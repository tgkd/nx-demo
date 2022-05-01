import React, { forwardRef } from 'react';
import { FlatList, FlatListProps } from 'react-native';
import Animated from 'react-native-reanimated';

const ReanimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const AnimatedFlatList = forwardRef<FlatList, FlatListProps<unknown>>(
  (props, ref) => <ReanimatedFlatList ref={ref} {...props} />
);
