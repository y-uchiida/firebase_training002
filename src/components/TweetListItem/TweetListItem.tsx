import { Avatar } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useSelector } from 'react-redux'
import { Tweet } from '../../@types/Tweet'
import { selectUser } from '../../features/userSlice'
import { db } from '../../firebase'
import styles from './TweetListItem.module.css'

interface props {
	tweet: Tweet
};

export const TweetListItem = ({ tweet }: props) => {
	const user = useSelector(selectUser);

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
		</>
	)
}
