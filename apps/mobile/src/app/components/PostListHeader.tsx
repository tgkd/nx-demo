import React from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 44,
    paddingBottom: 16,
    backgroundColor: 'tomato'
  },
});

interface Props {
  isScrolling: SharedValue<boolean>;
  height: SharedValue<number>;
  scrollPosition: SharedValue<number>;
  onLayout: (e: LayoutChangeEvent) => void;
}

export function ListHeader(props: Props) {

  return (
    <View onLayout={props.onLayout} style={styles.container}>
      <Text>{'Header'}</Text>
    </View>
  );
}
