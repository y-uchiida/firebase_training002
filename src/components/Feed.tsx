import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import { TweetInput } from './TweetInput/TweetInput';
import styles from './Feed.module.css'
import { Tweet } from '../@types/Tweet';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { TweetListItem } from './TweetListItem/TweetListItem';

interface props {
	isSignIn: boolean,
	setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>
};

export const Feed = ({ isSignIn, setIsSignIn }: props) => {

	const [tweets, setTweets] = useState<Tweet[]>([]);

	/* 初回マウント時のみ実行する処理を記述 */
	useEffect(() => {
		const tweetsCollectionRef = collection(db, 'tweets');
		const q = query(tweetsCollectionRef, orderBy('timestamp', 'desc'));
		const unSub = onSnapshot(q, (snapshot) => {
			setTweets(snapshot.docs.map<Tweet>((doc) => {
				return {
					id: doc.id,
					avatar: doc.data().avatar,
					text: doc.data().text,
					image: doc.data().image,
					timestamp: doc.data().timestamp,
					username: doc.data().userName,
				};
			}));
		});
		return unSub;
	}, []);
	return (
		<>
			<div className={styles.feed}>
				<TweetInput></TweetInput>
				{tweets[0]?.id && (<>
					{tweets.map(tweet => {
						return <TweetListItem key={tweet.id} tweet={tweet}></TweetListItem>
					})}
				</>)}

			</div>
		</>
	)
}
