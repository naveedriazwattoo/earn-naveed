"use client"

import SigninButton from '../Buttons/SigninButton'
import { useMemo } from 'react'

interface SigninButtonStateProps {
  isLoading: boolean;
  error: string | null;
  isSignedIn: boolean;
  onSignIn: () => void;
}

const SigninButtonState = ({ isLoading, error, isSignedIn, onSignIn }: SigninButtonStateProps) => {
  const button = useMemo(() => {
    console.log("Button isLoading: ", isLoading);
    console.log("Button error: ", error);
    console.log("Button isSignedIn: ", isSignedIn); 
    console.log("Button onSignIn: ", onSignIn);
    // if (isLoading) {
    //   return <SigninButton onSignIn={onSignIn} disabled={isLoading} />;
    // }
    // else if (!isLoading) {
    //   return <SigninButton onSignIn={onSignIn} />;
    // }
    // else if (error) {
    //   return <SigninButton onSignIn={onSignIn} />;
    // } 
    // else if (isSignedIn) {
    //   return <SigninButton onSignIn={onSignIn} disabled={true} />;
    // }
    return <SigninButton onSignIn={onSignIn} />;
  }, [isLoading, error, isSignedIn, onSignIn]);

  return button;
};

export default SigninButtonState; 