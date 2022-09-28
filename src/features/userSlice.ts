import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface User {
	uid: string,
	photoUrl: string,
	displayName: string,
}

const userInitialState = {
	user: {
		uid: '',
		photoUrl: '',
		displayName: ''
	}
};

export const userSlice = createSlice({
	name: 'user',
	initialState: userInitialState,
	reducers: {
		login: (state, action) => {
			state.user = action.payload;
		},
		logout: (state) => {
			state = userInitialState;
		}
	},
});

export const { login, logout } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const userReducer = userSlice.reducer;
