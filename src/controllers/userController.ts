import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

import { User, UserDocument } from '../models/User';
import { Career } from '../models/Career';
import { Post } from '../models/Post';
import { Apply, ApplyDocument } from '../models/Apply';

const testUserId: string = '5e1d2302a690f093ecab0ea5';

// GET -> 현재 로그인된 회원 조회
export const findAuthorizedUser = async (req: Request, res: Response, next: NextFunction) => {
    const loginUser: UserDocument = req.user as UserDocument;
    try {
        // const user = await User.findById(loginUser.id, (err) => {
        const user = await User.findById(testUserId, (err) => {
            if (err) {
                console.log(err);
                next(err);
            }
        });
        // const careerList = await Career.find({ userId: loginUser.id });
        const careerList = await Career.find({ userId: testUserId });
        res.status(200).json({ user, careerList });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// GET -> 메인화면이나 게시물 목록 화면에서 게시물 클릭했을 때 해당 게시물 지원자들의 닉네임과 번호의 리스트 조회
export const findApplicant = async (req: Request, res: Response, next: NextFunction) => {
    const loginUser: UserDocument = req.user as UserDocument;
    try {
        await Post.findById(req.params.postId, async (err, post) => {
            if(err) {
                console.log(err);
                next(err);
            }
            if(!post) {
                console.log('해당하는 id의 게시물이 존재하지 않습니다.');
                res.status(404).json({ message: '해당하는 id의 게시물이 존재하지 않습니다.'});
            } else {
                // if (post.userId != loginUser.id) {
                if (post.userId != testUserId) {
                    res.status(204).json({ message: '로그인된 사용자만 지원목록을 볼 수 있습니다.'});
                } else {
                    const appliers = [];
                    const applies: ApplyDocument[] = await Apply.find({ postId : req.params.postId });
                    
                    for (const i in applies) {
                        const result = await User.findById(applies[i].userId);
                        appliers.push(result);
                    }
                    // const appliers = applies.map(async apply => await User.findById(apply.userId));

                    res.status(200).json(appliers);
                }
            }
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// GET -> 게시물 상세보기 화면에서 닉네임 클릭했을 때 (지원자 or 게시자)의 프로필 조회
// 지원자는 클라이언트에서 접근할 때 user.id
// 게시자는 클라이언트에서 접근할 때 post.userId
export const findUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await User.findById(req.params.userId, async (err, user) => {
            if (err) {
                console.log(err);
                next(err);
            }
            if (!user) {
                console.log('해당하는 id의 게시물이 존재하지 않습니다.');
                res.status(404).json({ message : '해당하는 id의 사용자가 존재하지 않습니다.'});
            } else {
                const careerList = await Career.find({ userId: req.params.userId });
                res.status(200).json({ user, careerList });  
            }
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

//PUT -> 로그인된 회원 정보 수정
export const modifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const loginUser: UserDocument = req.user as UserDocument;
    const file = req.file as Express.Multer.File;
    const { name, gender, age, address1, address2, intro } = req.body;
    let img;
    try {
        await body(['name', 'age', 'address1', 'address2', 'intro'], 'this is not String type').isString().run(req);
        await body('gender', 'this is not Boolean type').isBoolean().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('express-validator bad request');
            return res.status(422).json({ message: errors.array() });
        }

        if(file !=null) {
            img = `/img/${file.filename}`;
        } else {
            img = null;
        }

        // await User.findByIdAndUpdate(loginUser.id, { name, gender, age, address1, address2, intro, img }, (err) => {
        await User.findByIdAndUpdate(testUserId, { name, gender, age, address1, address2, intro, img }, (err) => {
            if (err) {
                console.log(err);
                next(err);
            }
        });

        res.status(201).json({ message : '성공적으로 수정되었습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// DELETE -> 로그인된 회원 탈퇴
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const loginUser: UserDocument = req.user as UserDocument;
    try {
        // await User.findByIdAndDelete(loginUser.id, (err) => {
        await User.findByIdAndDelete(testUserId, (err) => {
            if (err) {
                console.log(err);
                next(err);
            }
        });
        res.status(204).json({ message : '성공적으로 삭제되었습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
  }
};