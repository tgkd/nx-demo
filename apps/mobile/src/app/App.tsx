import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useStore } from 'effector-react';

import { $list, pagingChanged } from '@nx-demo/store';

export default function App() {
  const list = useStore($list);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`ListLen: ${list.length}`}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
  },
});
