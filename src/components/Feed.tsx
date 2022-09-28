import { Button } from '@mui/material';
import React from 'react'
import { auth } from '../firebase';

interface props {
	isSignIn: boolean,
	setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>
};

export const Feed = ({ isSignIn, setIsSignIn }: props) => {

	const signOutHandle = async () => {
		await auth.signOut().catch(err => {
			alert(err.message)
		});
		setIsSignIn(false);
	};

	return (
		<>
			<div>Feed</div>
			<Button
				type='button'
				onClick={() => signOutHandle()}
			>
				SignOut
			</Button>
		</>
	)
}
