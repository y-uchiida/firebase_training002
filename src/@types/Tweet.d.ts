import { FieldValue, Timestamp } from "firebase/firestore";

export interface Tweet {
	id: string,
	avatar: string,
	image: string,
	text: string,
	timestamp: Timestamp | null,
	username: string
};
