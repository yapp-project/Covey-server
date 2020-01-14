import { Request, Response, NextFunction } from 'express';
import request from 'request';
import cache from 'memory-cache';

import { SENS_ACCESSKEYID, SENS_SERVICESECRET } from '../config/secret';
import { User, UserDocument } from '../models/User';

const testUserId: string = '5e1d2302a690f093ecab0ea5';

// GET -> 로그아웃
export const logout = (req: Request, res: Response, next: NextFunction) => {
    req.logout();  // req.user객체를 제거하는 역할
    req.session?.destroy((err) => {
        if (err) {
            console.error(err);
            next(err);
        }
    });  // req.session 객체내용 제거 역할
    res.status(204).json({ message : '로그아웃에 성공하였습니다.' });
};

// POST -> 폰번호 입력받고 해당 번호로 인증번호 발송
export const sendCodeToPhone = (req: Request, res: Response) => {

    // 클라에서 받은 핸드폰번호
    const { phoneNum } = req.body;  //  문자열이었음

    // 서버에서 생성한 인증번호
    const verifyNum = Math.floor(Math.random()*10000000) + 1;
    // 만약 클라에서 입력받은 폰번호가 키값으로 이미 메모리캐시에 올라가져있다면 먼저 있던걸 삭제
    cache.del(phoneNum);

    //phoneNum이라는 key에다가 verifyNum이라는 value를 메모리캐시에 4분동안 저장 / 이후 자동삭제됨
    cache.put(phoneNum, verifyNum, 180000);

    // naver sens에 request 발생시킨다.
    request({
        method: 'POST',
        json: true,
        uri: 'https://api-sens.ncloud.com/v1/sms/services/ncp:sms:kr:256928778264:yapp_covey/messages',
        headers: {
            'Content-Type': 'application/json',
            'X-NCP-auth-key': SENS_ACCESSKEYID,
            'X-NCP-service-secret': SENS_SERVICESECRET,
        },
        body: {
            type: 'sms',
            from: '01058509766',
            to: [`${phoneNum}`],
            content: `Covey 가입을 위한 인증번호는 ${verifyNum}입니다.`
        }
    });
    return res.status(201).json({ message: '인증번호 전송 완료' });
};

// POST -> 사용자가 입력한 인증번호로 인증
export const verifyCode  = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const { phoneNum, verifyNumFromClient } = req.body;  // verifyNumFromClient는 문자열
        const verifyNumFromServer = cache.get(phoneNum);
        const loginUser: UserDocument = req.user as UserDocument;

        if (verifyNumFromServer == verifyNumFromClient) {
            // await User.findByIdAndUpdate(loginUser, { phoneNum });
            await User.findByIdAndUpdate(testUserId, { phoneNum });
            res.status(201).json({message : '인증에 성공하였습니다.'});
        } else {
            // 인증번호가 일치하지않을 경우
            // ......
            res.status(401).json({message : '인증에 실패하였습니다.'});
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
};