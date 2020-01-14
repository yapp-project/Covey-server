import { Request, Response, NextFunction } from 'express';

import { Apply, ApplyDocument } from '../models/Apply';
import { UserDocument } from '../models/User';
import { Post } from '../models/Post';

const testUserId: string = '5e1d2302a690f093ecab0ea5';

// POST -> 게시물 지원하기
export const applyPost = async (req: Request, res: Response, next: NextFunction) => {
    const loginUser = req.user as UserDocument;
    const postId = req.params.postId;
    try {

        await Post.findById(postId, (err, post) => {
            if (err) {
                console.log(err);
                next(err);
            }
            if (!post) {
                return res.status(400).json({ message: '해당 아이디의 게시물이 존재하지않습니다.'});
            }
        });

        const apply: ApplyDocument =  new Apply({
            // userId : loginUser.id,
            userId : testUserId,
            postId,
        });
        await apply.save((err: Error) => {
            if(err) {
                console.log(err);
                next(err);
            }
        });
        res.status(201).json({ message : '지원에 성공했습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// GET -> 자신이 지원한 게시물 리스트 조회
export const findAllApplied = async (req: Request, res: Response, next: NextFunction) => {
    const loginUser = req.user as UserDocument;
    try {
        // const applies = await Apply.find({ userId: loginUser.id });
        const applies: ApplyDocument[] = await Apply.find({ userId: testUserId });
        const posts = [];

        for (const i in applies) {
            const result = await Post.findById(applies[i].postId);
            posts.push(result);
        }

        // const post = applies.map(async v => await Post.findById(v.postId));

        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        next(err);
    }
};


// DELETE -> 지원 취소
export const cancelApply = async (req: Request, res: Response, next: NextFunction) => {
    const loginUser = req.user as UserDocument;
    const postId = req.params.postId;
    try {
        await Apply.deleteOne({
            // userId: loginUser.id,
            userId: testUserId,
            postId
        });
        res.status(204).json({ message : '해당 게시물에 지원을 취소하였습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};