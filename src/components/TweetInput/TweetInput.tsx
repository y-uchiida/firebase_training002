import { Avatar, Button, Grid, IconButton, TextField } from '@mui/material'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { signOut } from 'firebase/auth'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUser } from '../../features/userSlice'
import { storage, db, auth } from '../../firebase'
import styles from './TweetInput.module.css'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { generateRandomString } from '../../helpers/helper';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export const TweetInput = () => {
	const user = useSelector(selectUser);
	const dispatch = useDispatch();

	const [tweetMessage, setTweetMessage] = useState('');
	const [tweetImage, setTweetImage] = useState<File | null>(null);

	/* 投稿する画像を選択するinputが変化した場合のハンドラ */
	const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files![0]) {
			setTweetImage(e.target.files![0]);
			e.target.value = '';
		}
	};

	/** ツイートの送信処理
	 * 画像添付の有無によって処理を切り替える
	 */
	const sendTweet = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (tweetImage) {
			let imageUrl = '';
			const fileName = generateRandomString() + '_' + tweetImage.name;
			const ImageRef = await ref(storage, `images/${fileName}`);
			await uploadBytes(ImageRef, tweetImage).then(async () => {
				await getDownloadURL(ImageRef).then((downloadUrl) => {
					imageUrl = downloadUrl;
				});
				addDoc(collection(db, '/tweets'), {
					avatar: user.photoUrl,
					image: imageUrl,
					text: tweetMessage,
					timestamp: serverTimestamp(),
					userName: user.displayName
				});
			}).catch(err => {
				alert(err.message);
			});
		} else {
			addDoc(collection(db, '/tweets'), {
				avatar: user.photoUrl,
				image: '',
				text: tweetMessage,
				timestamp: serverTimestamp(),
				userName: user.displayName
			})
				.then(() => { console.log('done') })
				.catch(err => { console.log(err) });
		}

		// 入力されたツイートテキストと画像をフォームから消去
		setTweetMessage('');
		setTweetImage(null);
	};

	return (
		<ThemeProvider theme={theme}>
			<Grid container>
				<Grid item marginRight={4}>
					<Avatar
						className='tweet_avatar'
						src={user.photoUrl}
						onClick={async () => {
							await signOut(auth);
							dispatch(logout());
						}}
					>
					</Avatar>
				</Grid>
				<Grid item xs>
					<div>
						<form onSubmit={sendTweet}>
							<TextField
								placeholder="What's happing?"
								type='text'
								autoFocus
								value={tweetMessage}
								variant='outlined'
								onChange={(e) => setTweetMessage(e.target.value)}
							>
							</TextField>
							<IconButton>
								<label>
									<AddAPhotoIcon
										fontSize='large'
										className={
											tweetImage ? styles.tweet_addIconAdded : styles.tweet_addIcon
										}
									/>
									<input
										className={styles.tweet_hiddenIcon}
										type="file"
										onChange={onChangeImageHandler}
									/>
								</label>

							</IconButton>
							<Button
								variant="contained"
								disabled={!tweetMessage}
								type='submit'
							>
								Tweet
							</Button>
						</form>
					</div>
				</Grid>




			</Grid>
		</ThemeProvider >
	)
}
