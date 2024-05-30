import { ObjectId } from "mongodb";

export interface Session {
  user: ObjectId;
  _id: ObjectId;
  expiresAt: Date;
  __v: number;
}

export interface User {
  username: string;
  email: string;
  avatar: string;
  googleAuth: boolean;
  _id: ObjectId;
  __v: number;
}

export interface ReqUser {
  user: User;
  session: Session;
}
