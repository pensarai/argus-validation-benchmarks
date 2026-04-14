import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { isAuthenticated } from './storage/tokens';
import AuthStack from './navigation/AuthStack';
import MainStack from './navigation/MainStack';
import { registerForPushNotifications } from './notifications/pushService';

export default function App(): React.ReactElement {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authed = await isAuthenticated();
      setIsLoggedIn(authed);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      registerForPushNotifications().catch(() => {});
    }
  }, [isLoggedIn]);

  if (isLoggedIn === null) return <></>;

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
