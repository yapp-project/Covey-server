import { Schema, model, Document,  } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Types : { ObjectId } } = Schema;

export type PostDocument = Document & {
    userId: string;
    title: string;
    startDate: Date;
    endDate: Date;
    dueDate: Date;
    isDue: boolean;
    workingTime: string;
    address1: string;
    address2: string;
    address3: string;
    pay: number;
    description: string;
    category: string;
    imgUrl1: string;
    imgUrl2: string;
    imgUrl3: string;
    createdAt: Date;
};

const postSchema = new Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: false
    },
    startDate: {
        type: Date,
        required: false
    },
    endDate: {
        type: Date,
        required: false
    },
    dueDate: {
        type: Date,
        required: false
    },
    isDue: {
        type: Boolean,
        default: false
    },
    workingTime: {
        type: String,
        required: false
    },
    address1: {
        type: String,
        required: false
    },
    address2: {
        type: String,
        required: false
    },
    address3: {
        type: String,
        required: false
    },
    pay: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        enum: ['식당', '카페', '술집', '편의점', '잡화매장', '독서실', 'PC방', '기타'],
        required: false,
    },
    imgUrl1: {
        type: String,
        required: false,
    },
    imgUrl2: {
        type: String,
        required: false,
    },
    imgUrl3: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

postSchema.plugin(mongoosePaginate);

export const Post = model<PostDocument>('Post', postSchema);