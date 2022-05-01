import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';

import { routes } from '../routes';
import { colors } from '../theme';

export function SplashScreen() {
  const init = useCallback(async () => {
    try {
      Navigation.setRoot({
        root: {
          stack: {
            children: [{ component: { name: routes.list } }],
            options: {
              animations: {
                setRoot: {
                  waitForRender: true,
                  alpha: { duration: 200, from: 0.5 },
                },
              },
              topBar: { visible: false },
            },
          },
        },
      });
    } catch (error) {
      console.log('init', error);
    }
  }, []);

  useEffect(() => {
    init();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
