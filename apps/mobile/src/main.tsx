import { Navigation } from 'react-native-navigation';

import { ListScreen, SplashScreen } from './app/screens';
import { routes } from './app/routes';

Navigation.registerComponent(routes.splash, () => SplashScreen);
Navigation.registerComponent(routes.list, () => ListScreen);

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
