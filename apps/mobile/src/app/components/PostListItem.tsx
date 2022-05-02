import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { ListItem } from '@nx-demo/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16
  },
});

interface Props {
  item: ListItem;
}

export function PostListItem(props: Props) {
  return (
    <View style={styles.container}>
      <Text>{props.item.name}</Text>
      <Text>{props.item.description}</Text>
    </View>
  );
}
