import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid, IconButton, InputAdornment, OpenReason, TextField } from '@mui/material';
import { EmailOutlined } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';

import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 440,
	bgcolor: 'background.paper',
	borderRadius: '4px',
	border: 'none',
	boxShadow: 24,
	p: 3,
};

interface props {
	open: boolean,
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	resetPasswordMailTo: string,
	setResetPasswordMailTo: React.Dispatch<React.SetStateAction<string>>
};

export default function ResetPassWordModal(
	{
		open, setOpen, resetPasswordMailTo, setResetPasswordMailTo
	}: props
) {
	const handleClose = () => setOpen(false);

	const sendResetPasswordMail = async (e: React.MouseEvent<HTMLElement>) => {
		await sendPasswordResetEmail(auth, resetPasswordMailTo)
			.then(() => {
				alert('Sent a mail to your address. Please check inbox.');
				setOpen(false);
				setResetPasswordMailTo('');
			})
			.catch(err => {
				alert(err.message);
				setResetPasswordMailTo('');
			});
	};

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Reset password
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						Input your email address to send password reset url.
					</Typography>

					<Grid container>
						<Grid item xs>

							<TextField
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<EmailOutlined />
										</InputAdornment>
									),
								}}
								variant='standard'
								margin="normal"
								required
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								autoFocus
								type='email'
								value={resetPasswordMailTo}
								onChange={e => setResetPasswordMailTo(e.target.value)}
							/>
						</Grid>
						<Grid item>
							<Button
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
								onClick={sendResetPasswordMail}
							>
								<SendIcon></SendIcon>
								Send
							</Button>
						</Grid>
					</Grid>
				</Box>
			</Modal>
		</div>
	);
}
