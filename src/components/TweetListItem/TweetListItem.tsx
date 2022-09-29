import { Avatar, Button, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Tweet } from '../../@types/Tweet'
import { selectUser } from '../../features/userSlice'
import { db } from '../../firebase'
import styles from './TweetListItem.module.css'

interface props {
	tweet: Tweet
};

interface reply {
	id: string,
	avatar: string,
	text: string,
	timestamp: Timestamp | null,
	username: string
}

export const TweetListItem = ({ tweet }: props) => {
	const user = useSelector(selectUser);
	const [reply, setReply] = useState('');
	const [replies, setReplies] = useState<reply[]>([]);

	/** tweetごとにcommentを取得する副作用処理を記述 */
	useEffect(() => {
		const repliesCollectionRef = collection(db, 'tweets', tweet.id, 'replies');
		const q = query(repliesCollectionRef, orderBy('timestamp', 'desc'));
		const unSub = onSnapshot(q, snapshot => {
			setReplies(snapshot.docs.map<reply>(doc => {
				return {
					id: doc.id,
					avatar: doc.data().avatar,
					text: doc.data().text,
					timestamp: doc.data().timestamp,
					username: doc.data().userName,
				};
			}));
		});
		return unSub;
	}, [tweet.id]);


	const newReply = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const commentsCollectionRef = collection(db, 'tweets', tweet.id, 'replies');
		addDoc(commentsCollectionRef, {
			avatar: user.photoUrl,
			text: reply,
			timestamp: serverTimestamp(),
			userName: user.displayName,
		}).then(() => {
			setReply('');
		});
	};

	return (
		<>
			<div className={styles.post_avatar}>
				<Avatar src={tweet.avatar} />
			</div>
			<div className={styles.post_body}>
				<div>
					<div className={styles.post_header}>
						<h3>
							<span className={styles.post_headerUser}>@{tweet.username}</span>
							<span className={styles.post_headerTime}>
								{tweet.timestamp?.toDate().toLocaleString()}
							</span>
						</h3>
					</div>
					<div className={styles.post_tweet}>
						<p>{tweet.text}</p>
					</div>
				</div>
			</div>
			{tweet.image && (
				<div className={styles.post_tweetImage}>
					<img src={tweet.image} alt="tweet" />
				</div>
			)}

			{replies.map(reply => {
				return <div className={styles.post_comment} key={reply.id}>
					<Avatar src={reply.avatar} />
					<span className={styles.post_commentUser}>@{reply.username}</span>
					<span className={styles.post_commentText}>{reply.text}</span>
					<span className={styles.post_headerTime}>
						{reply.timestamp?.toDate().toDateString()}
					</span>
				</div>
			})}

			<form onSubmit={newReply}>
				<div className={styles.post_form}>
					<TextField
						type='text'
						placeholder='reply to this tweet...'
						value={reply}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setReply(e.target.value);
						}}
					>
					</TextField>
					<Button
						disabled={!reply}
						type='submit'
						variant="contained"
					>
						Reply
					</Button>
				</div>
			</form>
		</>
	)
}
