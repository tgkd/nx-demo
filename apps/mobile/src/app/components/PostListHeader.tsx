import { Button } from '@nx-demo/mob-ui';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View
} from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import BlogIcon from '../icons/blog.svg';
import UserIcon from '../icons/user.svg';
import { colors } from '../theme';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam mollitia obcaecati neque minima quia ad.';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = 56;
const PADDING = 12;
const HEIGHT_MIN = 68;
const HEIGHT_MAX = 126;
const AVATAR_START = HEIGHT_MAX - AVATAR_SIZE - PADDING;
const AVATAR_END = -PADDING;
const PADDING_MIN = 24;
const PADDING_MAX = 44;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: PADDING,
    paddingBottom: PADDING,
    width,
    zIndex: 100,
    backgroundColor: colors['blue-grey-900'],
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: AVATAR_SIZE,
    width: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: colors['grey-900'],
  },
  avatar: {
    height: AVATAR_SIZE / 2,
    width: AVATAR_SIZE / 2,
  },
  info: {
    maxWidth: width - AVATAR_SIZE - PADDING,
    marginLeft: 12,
    paddingRight: 22,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors['light-primary'],
  },
  desc: {
    fontSize: 12,
    color: colors['light-secondary'],
  },
  popupBtn: {
    position: 'absolute',
    right: PADDING,
    top: 24,
    height: 24,
    width: 24,
    borderRadius: 12,
    padding: 4,
    backgroundColor: colors['white'],
  },
});

interface Props {
  isScrolling: SharedValue<boolean>;
  scrollPosition: SharedValue<number>;
}

export function ListHeader({ scrollPosition }: Props) {
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

  const showPopup = () => {
    console.log('TODO: user popup');
  };

  const containerStyle = useAnimatedStyle(
    () => ({
      height: interpolate(progress.value, [0, 1], [HEIGHT_MIN, HEIGHT_MAX]),
      paddingTop: interpolate(progress.value, [0, 1], [PADDING_MIN, PADDING_MAX]),
    }),
    [progress]
  );

  const avatarStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [AVATAR_END, AVATAR_START]
          ),
        },
        {
          scale: interpolate(progress.value, [0, 1], [0.75, 1]),
        },
      ],
    }),
    [progress]
  );

  const descStyle = useAnimatedStyle(
    () => ({
      opacity: progress.value,
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [-30, 0]),
        },
      ],
    }),
    [progress]
  );

  const titleStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [4, 0]),
        },
      ],
    }),
    [progress]
  );

  return (
    <Animated.View style={[containerStyle, styles.container]}>
      <Animated.View style={[avatarStyle, styles.avatarContainer]}>
        <UserIcon style={styles.avatar} />
      </Animated.View>
      <View style={styles.info}>
        <Animated.Text style={[titleStyle, styles.username]}>
          {'New User'}
        </Animated.Text>

        <Animated.Text numberOfLines={3} style={[descStyle, styles.desc]}>
          {LOREM}
        </Animated.Text>
      </View>
      <Button style={styles.popupBtn} onPress={showPopup}>
        <BlogIcon />
      </Button>
    </Animated.View>
  );
}
