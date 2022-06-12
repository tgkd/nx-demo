import React from 'react';
import { Navigation } from 'react-native-navigation';

import { ListScreen, SplashScreen } from './app/screens';
import { routes } from './app/routes';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function withSafeArea(Component) {
  return function WrapperComponent(props) {
    return (
      <SafeAreaProvider>
        <Component {...props} />
      </SafeAreaProvider>
    );
  };
}

Navigation.registerComponent(routes.splash, () => withSafeArea(SplashScreen));
Navigation.registerComponent(routes.list, () => withSafeArea(ListScreen));

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: routes.splash,
            },
          },
        ],
      },
    },
  });
});
