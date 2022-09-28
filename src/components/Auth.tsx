import React from 'react'
import { useState } from 'react';
import SignInSide from './SignInSide/SignInSide'

interface props {
	isSignIn: boolean,
	setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>
};

export const Auth = ({ isSignIn, setIsSignIn }: props) => {
	return (
		<SignInSide isSignIn={isSignIn} setIsSignIn={setIsSignIn} />
	)
}
