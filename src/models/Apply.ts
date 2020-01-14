import { Schema, model, Document } from 'mongoose';

const { Types : { ObjectId } } = Schema;

export type ApplyDocument = Document & {
    userId: string;
    postId: string;
    createdAt: Date;
};

const applySchema = new Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    postId: {
        type: ObjectId,
        required: true,
        ref: 'Post'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});



export const Apply = model<ApplyDocument>('Apply', applySchema);