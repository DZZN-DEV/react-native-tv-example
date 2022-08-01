import { differenceInMilliseconds } from 'date-fns';
import { withNavigation } from 'hocs/withNavigation';
import { withSafeAreaContext } from 'hocs/withSafeAreaContext';
import ms from 'ms';
import React, { useEffect, useRef, useState } from 'react';
import { LogBox } from 'react-native';
import Config from 'react-native-config';
import { useApp } from 'store/app/hooks';
import { withStore } from 'store/withStore';

import Navigation from './Navigation';
import Screen from './Screen';

if (Config.DISABLE_YELLOW_BOX) {
  LogBox.ignoreAllLogs();
}

const App = () => {
  const mountTime = useRef<Date>();
  const { bootstrap, isLoading, hasError } = useApp();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (mountTime.current && !isLoading && !hasError) {
      setTimeout(() => {
        setIsReady(true);
        // some arbitrary logic to make sure the splash is always shown at least 1 second
      }, Math.max(ms('1 seconds') - differenceInMilliseconds(new Date(), mountTime.current), ms('1 seconds')));
      return;
    }

    if (!mountTime.current) {
      mountTime.current = new Date();
      bootstrap();
    }
  }, [hasError, isLoading, bootstrap]);

  if (!isReady) {
    return <Screen.Splash />;
  }

  return <Navigation />;
};

export default withSafeAreaContext(withNavigation(withStore(App)));