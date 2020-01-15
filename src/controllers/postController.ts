import { Request, Response, NextFunction } from 'express';
import { PaginateOptions, Error } from 'mongoose';
import { query, body, validationResult } from 'express-validator';

import { Post, PostDocument } from '../models/Post';
import { UserDocument } from '../models/User';

const testUserId: string = '5e1d2302a690f093ecab0ea5';

// // GET -> 필터링 게시물 조회 (+ 최근 등록 순서 페이징 처리)
export const findAllPost = async (req: Request, res: Response, next: NextFunction) => {
    const { pay, address1, address2, category, startDate, endDate }: PostDocument = req.query;
    const page: number = parseInt(req.params.page, 10);
    const queryOptions = {
        pay: { $gte: pay },
        category,
        address1,
        address2,
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
        isDue: false,
    };
    const paginateOptions: PaginateOptions = {
        page,
        limit: 10,
        sort: { createdAt: 'desc' }
    };
    try {
        await query(['startDate', 'endDate', 'address1', 'address2', 'category'], 'this is not string type').isString().run(req);
        await query(['startDate', 'endDate'], 'must be 0000-00-00 format').isISO8601().run(req);
        await query('pay', 'this is not number type').isNumeric().run(req);
        await query('category', 'this is not in categoryList').isIn(['식당', '카페', '술집', '편의점', '잡화매장', '독서실', 'PC방', '기타']).run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('express-validator bad request');
            return res.status(422).json({ message: errors.array() });
        }
        const result = await Post.paginate(queryOptions, paginateOptions);
        res.status(200).json(result.docs);
    }  catch (err) {
        console.error(err);
        next(err);
    }
};

// GET -> 고수익 알바 게시물 리스트 조회
export const findHighPayPost = async (req: Request, res: Response, next: NextFunction) => {
    const page: number = parseInt(req.params.page, 10);
    const queryOptions = {
        isDue: false,
    };
    const paginateOptions: PaginateOptions = {
        page,
        limit: 10,
        sort: { pay: 'desc' }
    };
    try {
        const result = await Post.paginate(queryOptions, paginateOptions);
        res.status(200).json(result.docs);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// GET -> 우리 동네 알바 게시물 리스트 조회
export const findSameAddressPost = async (req: Request, res: Response, next: NextFunction) => {
    const loginUser = req.user as UserDocument ;
    const page: number = parseInt(req.params.page, 10);
    const queryOptions = {
        // address1: loginUser.address1,
        // address2: loginUser.address2,
        address1: '서울특별시',
        address2: '중랑구',
        isDue: false,
    };
    const paginateOptions: PaginateOptions = {
        page,
        limit: 10,
        sort: { createdAt: 'desc' }
    };
    try {
        const result = await Post.paginate(queryOptions, paginateOptions);
        res.status(200).json(result.docs);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// GET -> 해당 카테고리의 게시물 리스트 조회
export const findCategoryPost = async (req: Request, res: Response, next: NextFunction) => {
    const { category }: PostDocument = req.query;
    const page: number = parseInt(req.params.page, 10);
    const queryOptions = {
        category,
        isDue: false,
    };
    const paginateOptions: PaginateOptions = {
        page,
        limit: 10,
        sort: { createdAt: 'desc' }
    };
    try {
        await query('category', 'this is not in categoryList').isIn(['식당', '카페', '술집', '편의점', '잡화매장', '독서실', 'PC방', '기타']).run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('express-validator bad request');
            return res.status(422).json({ message: errors.array() });
        }

        const result = await Post.paginate(queryOptions, paginateOptions);
        res.status(200).json(result.docs);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// GET -> post.id로 해당 게시물 상세 조회
export const findPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Post.findById(req.params.postId);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// GET -> 로그인된 사용자가 게시한 게시물 목록 조회
export const findPostByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const loginUser = req.user as UserDocument;
    try {
        const posts = await Post.find({ userId: testUserId });
        // const posts = await Post.find({ userId: loginUser.id });
      res.status(200).json(posts);
  } catch (err) {
      console.error(err);
      next(err);
  }
};

// POST -> 게시물 등록
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    
    const loginUser = req.user as UserDocument;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { title, startDate, endDate, dueDate, workingTime, address1, address2, address3, pay, description, category } = req.body;
    const { img1, img2, img3 } = files;
    let imgUrl1 = null;
    let imgUrl2 = null;
    let imgUrl3 = null;
    try {
        // 중복된 제목 validation
        const isConflict: number = (await Post.find()).filter(post => post.title===title).length;
        if (isConflict) {
            return res.status(409).json({ message: '중복된 제목의 게시물이 존재합니다.' });
        }

        // request body validation
        await body(['title', 'address1', 'address1', 'address1', 'description', 'startDate', 'endDate', 'dueDate', 'workingTime', 'category'], 'this is not string type').isString().run(req);
        await body(['startDate', 'endDate', 'dueDate'], 'must be 0000-00-00 format').isISO8601().run(req);
        await body('pay', 'this is not number type').isNumeric().run(req);
        await body('category', 'this is not in categoryList').isIn(['식당', '카페', '술집', '편의점', '잡화매장', '독서실', 'PC방', '기타']).run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('express-validator bad request');
            return res.status(422).json({ message: errors.array() });
        }
        
        if(img1 != null && img2 == null && img3 == null) {
            imgUrl1 = `/img/${img1[0].filename}`;
            imgUrl2 = null;
            imgUrl3 = null;
        } else if (img1 != null && img2 != null && img3 == null) {
            imgUrl1 = `/img/${img1[0].filename}`;
            imgUrl2 = `/img/${img2[0].filename}`;
            imgUrl3 = null;
        } else if (img1 != null && img2 != null && img3 != null){
            imgUrl1 = `/img/${img1[0].filename}`;
            imgUrl2 = `/img/${img2[0].filename}`;
            imgUrl3 = `/img/${img3[0].filename}`;
        }

        const post: PostDocument =  new Post({
            // userId : loginUser.id,
            userId : testUserId,
            title,
            startDate,
            endDate,
            dueDate,
            workingTime,
            address1,
            address2,
            address3,
            pay,
            description,
            category,
            imgUrl1,
            imgUrl2,
            imgUrl3
        });
        await post.save((err: Error) => {
            if(err) {
                console.log(err);
                next(err);
            }
        });
        res.status(201).json({ message : '성공적으로 게시물이 등록되었습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// PUT -> post.id로 해당 게시물 수정
export const modifyPost = async (req: Request, res: Response, next: NextFunction) => {
    const loginUser = req.user as UserDocument;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { title, startDate, endDate, dueDate, workingTime, address1, address2, address3, pay, description, category } = req.body;
    const { img1, img2, img3 } = files;
    const postId = req.params.postId;
    let imgUrl1;
    let imgUrl2;
    let imgUrl3;
    try {
        // 수정 권한
        const thisPost = await Post.findById(postId);
        const postUserId = thisPost?.userId;
        // if (postId != loginUser.id) {
        if (postUserId != testUserId) {
            return res.status(409).json({ message: '게시물을 수정할 권한이 없습니다.' });
        }

        // request body validation
        await body(['title', 'address1', 'address1', 'address1', 'description', 'startDate', 'endDate', 'dueDate', 'workingTime', 'category'], 'this is not string type').isString().run(req);
        await body(['startDate', 'endDate', 'dueDate'], 'must be 0000-00-00 format').isISO8601().run(req);
        await body('pay', 'this is not number type').isNumeric().run(req);
        await body('category', 'this is not in categoryList').isIn(['식당', '카페', '술집', '편의점', '잡화매장', '독서실', 'PC방', '기타']).run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('express-validator bad request');
            return res.status(422).json({ message: errors.array() });
        }
        
        // img파일 유무로 데이터에 넣을 url string값 할당
        if(img1 !=null && img2==null && img3==null) {
            imgUrl1 = `/img/${img1[0].filename}`;
            imgUrl2 = null;
            imgUrl3 = null;
        } else if (img1 !=null  && img2!=null && img3==null) {
            imgUrl1 = `/img/${img1[0].filename}`;
            imgUrl2 = `/img/${img2[0].filename}`;
            imgUrl3 = null;
        } else {
            imgUrl1 = `/img/${img1[0].filename}`;
            imgUrl2 = `/img/${img2[0].filename}`;
            imgUrl3 = `/img/${img3[0].filename}`;
        }

        await Post.findByIdAndUpdate(postId, {
            // userId : loginUser.id,
            userId : testUserId,
            title,
            startDate,
            endDate,
            dueDate,
            workingTime,
            address1,
            address2,
            address3,
            pay,
            description,
            category,
            imgUrl1,
            imgUrl2,
            imgUrl3,
        }, (err) => {
            if(err) {
                console.log(err);
                next(err);
            }
        });
        res.status(201).json({ message : '성공적으로 게시물이 수정되었습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// DELETE -> post.id로 해당 게시물 삭제
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    try {
        // 삭제 권한
        const thisPost = await Post.findById(postId);
        const postUserId = thisPost?.userId;
        // if (postId != loginUser.id) {
        if (postUserId != testUserId) {
            return res.status(409).json({ message: '게시물을 삭제할 권한이 없습니다.' });
        }

        await Post.findByIdAndDelete(postId);
        res.status(204).json({ message : '성공적으로 게시물이 삭제되었습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// PUT -> post.id로 해당 게시물 마감하기
export const duePost = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    try {
        // 마감 권한
        const thisPost = await Post.findById(postId);
        const postUserId = thisPost?.userId;
        // if (postId != loginUser.id) {
        if (postUserId != testUserId) {
            return res.status(409).json({ message: '게시물을 마감할 권한이 없습니다.' });
        }

        await Post.findByIdAndUpdate(postId, { isDue: true });
        res.status(201).json({ message : '성공적으로 마감이 완료되었습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};