import { Schema, model, Document } from 'mongoose';

export type UserDocument = Document & {
    snsId: string;
    name: string;
    gender: boolean;
    age: string;
    address1: string;
    address2: string;
    intro: string;
    phoneNum: string;
    img: string;
    createdAt: Date;
};

const userSchema = new Schema({
    snsId: {
        type: String,
        required: true
    },
    name: String,
    gender: Boolean,
    age: String,
    address1: String,
    address2: String,
    intro: String,
    phoneNum: String,
    img: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});



export const User = model<UserDocument>('User', userSchema);