import { Request, Response, NextFunction } from 'express';

import { Career, CareerDocument } from '../models/Career';
import { UserDocument } from '../models/User';
import { body, validationResult } from 'express-validator';

const testUserId: string = '5e1d2302a690f093ecab0ea5';

// GET -> 현재 로그인된 사용자의 경력사항 리스트 조회
export const findCareerList = async (req: Request, res: Response, next: NextFunction) => {
    const loginUser = req.user as UserDocument;
    try {
        // const careerList = await Career.find({ userId: loginUser.id });
        const careerList = await Career.find({ userId: testUserId });
        res.status(200).json(careerList);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// GET ->  클릭한 경력사항 정보 조회
export const findCareer = async (req: Request, res: Response, next: NextFunction) => {
    const careerId = req.params.careerId;
    try {
        const result = await Career.findById(careerId);
        if (!result) {
            res.status(404).json({ message : 'Not Found'});
            return;
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// POST -> 현재 로그인된 사용자의 경력사항 추가하기
export const createCareer = async (req: Request, res: Response, next: NextFunction) => {
    const loginUser = req.user as UserDocument;
    const { name, job, periodNum, periodUnit } = req.body;
    try {
        // request body validation
        await body(['name', 'job', 'periodNum', 'periodUnit'], 'this is not string type').isString().run(req);
        await body('periodUnit', 'this is not in categoryList').isIn(['주', '개월', '년', '기타']).run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('express-validator bad request');
            return res.status(422).json({ message: errors.array() });
        }

        const career: CareerDocument = new Career({
            // userId: loginUser.id,
            userId: testUserId,
            name,
            job,
            periodNum,
            periodUnit
        });

        await career.save((err: Error) => {
            if(err) {
                console.log(err);
                next(err);
            }
        });
        res.status(201).json({ message : '성공적으로 경력사항을 추가하였습니다.' });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// PUT -> 현재 로그인된 사용자의 경력사항 수정하기
export const modifyCareer = async (req: Request, res: Response, next: NextFunction) => {
    const { name, job, periodNum, periodUnit } = req.body;
    const careerId = req.params.careerId;
    try {
        // request body validation
        await body(['name', 'job', 'periodNum', 'periodUnit'], 'this is not string type').isString().run(req);
        await body('periodUnit', 'this is not in categoryList').isIn(['주', '개월', '년', '기타']).run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('express-validator bad request');
            return res.status(422).json({ message: errors.array() });
        }

        await Career.findByIdAndUpdate(careerId, {
            name,
            job,
            periodNum,
            periodUnit
        });
        res.status(201).json({ message : '성공적으로 해당 경력사항을 수정하였습니다.' });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// DELETE -> 현재 로그인된 사용자의 경력사항 삭제하기
export const deleteCareer = async (req: Request, res: Response, next: NextFunction) => {
    const careerId = req.params.careerId;
    try {
        await Career.findByIdAndDelete(careerId);
        res.status(204).json({ message: '성공적으로 해당 경력사항이 삭제되었습니다.' });
    } catch (err) {
        console.log(err);
        next(err);
    }
};