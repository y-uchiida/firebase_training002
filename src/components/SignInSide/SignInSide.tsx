import React, { FC, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';

import { styled } from '@mui/material/styles';

import styles from './SignInSide.module.css'
import { auth, googleAuthProvider, storage } from '../../firebase';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { IconButton, InputAdornment, Modal } from '@mui/material';
import { EmailOutlined, PasswordOutlined } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateUserProfile } from '../../features/userSlice';
import { useDispatch } from 'react-redux';
import ResetPassWordModal from '../ResetPasswordModal/ResetPasswordModal';
import { generateRandomString } from '../../helpers/helper';

const Copyright: React.FC<any> = (props: any) => {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{'Copyright © '}
			<Link color="inherit" href="https://mui.com/">
				Your Website
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const theme = createTheme();

interface props {
	isSignIn: boolean,
	setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>
};

const SignInSide: FC<props> = ({ isSignIn, setIsSignIn }: props) => {
	const [isRegisterMode, setIsRegisterMode] = useState(false);
	const dispatch = useDispatch();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [userName, setUserName] = useState('');
	const [avatarImage, setAvatarImage] = useState<File | null>(null);
	const [openModal, setOpenModal] = useState(false);
	const [resetPasswordMailTo, setResetPasswordMailTo] = useState('');

	const signInEmail = async () => {
		await signInWithEmailAndPassword(auth, email, password);
		setIsSignIn(true);
	};

	const signUpEmail = async () => {
		const user = await createUserWithEmailAndPassword(auth, email, password);
		let url = '';
		if (avatarImage) {
			const fileName = generateRandomString() + '_' + avatarImage.name;
			const avatarRef = await ref(storage, `avatars/${fileName}`);
			await uploadBytes(avatarRef, avatarImage);
			await getDownloadURL(avatarRef).then((downloadUrl) => {
				url = downloadUrl
			});
		}
		// firebase のユーザー情報を更新
		await updateProfile(user.user, {
			displayName: userName,
			photoURL: url,
		});

		// redux 側でもユーザー情報を更新
		dispatch(updateUserProfile({
			uid: user.user.uid,
			displayName: userName,
			photoUrl: url,
		}));

		// すべての処理が終わったら、ログイン状態をtrueにする
		setIsSignIn(true);
	}

	const signInGoogle = async () => {
		const result = await signInWithPopup(auth, googleAuthProvider).catch(err => {
			alert(err.message);
		});

		// すべての処理が終わったら、ログイン状態をtrueにする
		setIsSignIn(true);
	}
	const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// const data = new FormData(event.currentTarget);
		// console.log({
		// 	email: data.get('email'),
		// 	password: data.get('password'),
		// });
		isRegisterMode ?
			await signUpEmail().catch(err => {
				alert(err.message)
			})
			:
			await signInEmail().catch(err => {
				alert(err.message)
			})
	};

	const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files![0]) {
			setAvatarImage(e.target.files![0]);
			e.target.value = '';
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<Grid container component="main" sx={{ height: '100vh' }}>
				<CssBaseline />
				<Grid
					item
					xs={false}
					sm={4}
					md={7}
					sx={{
						// backgroundImage: 'url(https://source.unsplash.com/random)',
						backgroundImage: 'url(https://images.unsplash.com/photo-1664265694631-ce10e4a902ad?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)',
						backgroundRepeat: 'no-repeat',
						backgroundColor: (t) =>
							t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				/>
				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
					<Box
						sx={{
							my: 8,
							mx: 4,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component="h1" variant="h5">
							{isSignIn ? 'Sign in' : 'Register'}
						</Typography>
						<Box component="form" noValidate onSubmit={(e) => handleSubmit(e)} sx={{ mt: 1 }}>

							{isRegisterMode ?
								<TextField
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<PersonIcon />
											</InputAdornment>
										),
									}}
									margin="normal"
									required
									fullWidth
									id="username"
									label="User name"
									name="username"
									autoComplete="username"
									autoFocus
									value={userName}
									onChange={e => setUserName(e.target.value)}
								>

								</TextField> :
								<></>
							}
							<TextField
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<EmailOutlined />
										</InputAdornment>
									),
								}}
								margin="normal"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								autoFocus
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
							<TextField
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<PasswordOutlined />
										</InputAdornment>
									),
								}}
								margin="normal"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>

							{isRegisterMode ?
								<Box textAlign='center'>
									<IconButton>
										<label>
											<AccountCircleIcon
												fontSize='large'
												className={avatarImage ?
													styles.login_addIconLoaded
													:
													styles.login_addIcon
												}
											/>
											<input
												className={styles.login_hiddenIcon}
												type="file"
												onChange={onChangeImageHandler}
											/>
										</label>
									</IconButton>
								</Box>
								:
								<></>
							}

							<Button
								disabled={
									isRegisterMode ?
										!userName || !email || password.length < 6 || !avatarImage
										:
										!email || password.length < 6
								}
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
								onClick={(e) => handleSubmit(e)}
							>
								{isRegisterMode ? 'Register' : 'Sign in'}
							</Button>

							<Grid container>
								<Grid item xs>
									<span
										className={styles.login_reset}
										onClick={() => { setOpenModal(true) }}
									>
										Forgot Password?
									</span>
								</Grid>
								<Grid item>
									<span
										className={styles.login_toggleMode}
										onClick={() => setIsRegisterMode(!isRegisterMode)}
									>
										{isRegisterMode ?
											'Back to sign in' :
											'Create new account ?'
										}
									</span>
								</Grid>
							</Grid>

							<Button
								type="button"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
								onClick={signInGoogle}
								startIcon={<GoogleIcon></GoogleIcon>}
							>
								SignIn with Google
							</Button>

						</Box>
					</Box>
					<ResetPassWordModal
						open={openModal}
						setOpen={setOpenModal}
						resetPasswordMailTo={resetPasswordMailTo}
						setResetPasswordMailTo={setResetPasswordMailTo}
					/>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
}

export default SignInSide;
