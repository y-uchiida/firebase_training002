import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface UserInfo {
	uid: string,
	photoUrl: string,
	displayName: string,
}

const userInfoInitialState = {
	user: {
		uid: '',
		photoUrl: '',
		displayName: ''
	}
};

export const userSlice = createSlice({
	name: 'user',
	initialState: userInfoInitialState,
	reducers: {
		login: (state, action) => {
			state.user = action.payload;
		},
		logout: (state) => {
			state = userInfoInitialState;
		},
		updateUserProfile: (state, action: PayloadAction<UserInfo>) => {
			state.user.displayName = action.payload.displayName;
			state.user.photoUrl = action.payload.photoUrl;
		}
	},
});

export const { login, logout, updateUserProfile } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const userReducer = userSlice.reducer;
