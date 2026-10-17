import React from 'react';
import { AuthPage } from './AuthPage';

export const SignInPage: React.FC = () => {
  return <AuthPage initialMode="signin" />;
};
export default SignInPage;
