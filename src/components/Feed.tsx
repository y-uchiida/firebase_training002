import { Button } from '@mui/material';
import React from 'react'
import { auth } from '../firebase';
import { TweetInput } from './TweetInput/TweetInput';
import styles from './Feed.module.css'

interface props {
	isSignIn: boolean,
	setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>
};

export const Feed = ({ isSignIn, setIsSignIn }: props) => {

	return (
		<div className={styles.feed}>
			<TweetInput></TweetInput>
		</div>
	)
}
