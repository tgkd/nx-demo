import { useStore } from 'effector-react';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { AnimatedFlatList } from '@nx-demo/mob-ui';
import { $list, $paging, pagingChanged } from '@nx-demo/store';

import { ListHeader } from '../components/PostListHeader';
import { PostListItem } from '../components/PostListItem';
import { colors } from '../theme';

export function ListScreen() {
  const list = useStore($list);
  const paging = useStore($paging);
  const translationY = useSharedValue(0);
  const isScrolling = useSharedValue(false);

  useEffect(() => {
    pagingChanged({ ...paging });
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      translationY.value = event.contentOffset.y;
    },
    onMomentumBegin: () => {
      isScrolling.value = true;
    },
    onMomentumEnd: () => {
      isScrolling.value = false;
    },
  });

  const loadMore = () => {
    if (list.length < paging.total) {
      pagingChanged({ ...paging, page: paging.page + 1 });
    }
  };

  return (
    <View style={styles.container}>
      <ListHeader scrollPosition={translationY} isScrolling={isScrolling} />
      <AnimatedFlatList
        contentContainerStyle={styles.listContent}
        data={list}
        renderItem={PostListItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.9}
        keyExtractor={({ ID }) => `${ID}`}
        onScroll={scrollHandler}
        scrollEventThrottle={30}
        maxToRenderPerBatch={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: 16,
  },
});
