import { Schema, model, Document } from 'mongoose';

const { Types : { ObjectId } } = Schema;

export type CareerDocument = Document & {
    userId: string;
    name: string;
    job: string;
    periodNum: string;
    periodUnit: string;
};

const careerSchema = new Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
    },
    job: {
        type: String,
        required: true,
    },
    periodNum: {
        type: String,
        required: true,
    },
    periodUnit: {
        type: String,
        enum: ['주', '개월', '년', '기타'],
        required: true,
    }
});



export const Career = model<CareerDocument>('Career', careerSchema);