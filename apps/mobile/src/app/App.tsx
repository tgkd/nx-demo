import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useStore } from 'effector-react';

import { $list, $paging, pagingChanged } from '@nx-demo/store';
import { Button } from '@nx-demo/mob-ui';

export default function App() {
  const list = useStore($list);
  const paging = useStore($paging);

  useEffect(() => {
    pagingChanged({ ...paging });
  }, []);

  const loadMore = () => {
    pagingChanged({ ...paging, page: paging.page + 1 });
  };

  return (
    <View style={styles.container}>
      {list.map((p) => (
        <Text key={p.ID} style={styles.text}>
          {p.name}
        </Text>
      ))}
      <Button style={styles.btn} onPress={loadMore}>
        <Text>{'load'}</Text>
      </Button>
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
  btn: {
    marginTop: 32,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
  },
});
