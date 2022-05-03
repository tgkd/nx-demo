import React from 'react';
import { LayoutChangeEvent, StyleSheet, Text } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import UserIcon from '../icons/user.svg';

const AVATAR_SIZE = 64;
const PADDING_BOTTOM = 16;
const initTranslate = PADDING_BOTTOM + AVATAR_SIZE / 2;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 16,
    zIndex: 100,
    backgroundColor: '#bee',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: AVATAR_SIZE,
    width: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: '#ccc',
  },
  avatar: {
    height: AVATAR_SIZE / 2,
    width: AVATAR_SIZE / 2,
  },
});

interface Props {
  isScrolling: SharedValue<boolean>;
  scrollPosition: SharedValue<number>;
}

export function ListHeader({ scrollPosition }: Props) {
  const height = useSharedValue(0);
  const open = useSharedValue(true);

  const progress = useDerivedValue(
    () => withTiming(Number(open.value)),
    [open]
  );

  useAnimatedReaction(
    () => scrollPosition.value < 200,
    (result) => {
      if (result) {
        open.value = scrollPosition.value <= 10;
      }
    },
    [scrollPosition, open]
  );

  const onLayout = (e: LayoutChangeEvent) => {
    height.value = e.nativeEvent.layout.height;
  };

  const containerStyle = useAnimatedStyle(
    () => ({
      paddingTop: interpolate(progress.value, [0, 1], [8, 44]),
      paddingBottom: interpolate(progress.value, [0, 1], [8, PADDING_BOTTOM]),
    }),
    [progress]
  );

  const avatarStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [0, initTranslate]),
        },
        {
          scale: interpolate(progress.value, [0, 1], [0.75, 1]),
        },
      ],
    }),
    [progress]
  );

  return (
    <Animated.View
      onLayout={onLayout}
      style={[containerStyle, styles.container]}
    >
      <Text>{'USERNAME'}</Text>
      <Animated.View style={[avatarStyle, styles.avatarContainer]}>
        <UserIcon style={styles.avatar} />
      </Animated.View>
    </Animated.View>
  );
}
