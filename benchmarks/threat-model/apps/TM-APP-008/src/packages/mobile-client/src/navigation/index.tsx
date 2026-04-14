import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../storage/tokens';
import AuthStack from './AuthStack';
import MainStack from './MainStack';

export default function RootNavigator(): React.ReactElement {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const authed = await isAuthenticated();
      setIsLoggedIn(authed);
    };
    check();
  }, []);

  if (isLoggedIn === null) return <></>;

  return isLoggedIn ? <MainStack /> : <AuthStack />;
}

export const linking = {
  prefixes: ['projecthub://'],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      Dashboard: 'dashboard',
      Projects: 'projects',
      ProjectDetail: 'projects/:id',
      Tasks: 'tasks',
      Profile: 'profile',
      Settings: 'settings',
    },
  },
};
