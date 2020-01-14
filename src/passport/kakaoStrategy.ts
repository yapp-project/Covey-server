import { Strategy } from 'passport-kakao';
import { PassportStatic } from 'passport';
import { Error } from 'mongoose';

import { User } from '../models/User';
import { KAKAO_ID, KAKAO_SECRET } from '../config/secret';

export const kakao = (passport: PassportStatic) => {
    passport.use(new Strategy({
        clientID: KAKAO_ID,
        clientSecret: KAKAO_SECRET,
        callbackURL: '/api/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done)=>{
        try {
            console.log('kakao 로그인 전략 수행 시작');
            console.log(`kakao 토큰 : ${accessToken}`);
            console.log(`kakao 재생토큰 : ${refreshToken}`);
            
            const exUser = await User.findOne({ snsId: profile.id }, (err: Error) => {
                if(err) {
                    console.log(err);
                }
            });
            if (exUser) {
                console.log('이미 해당 카카오 아이디로 가입된 유저가 존재합니다.');
                done(null, exUser);
            } else {
                console.log('카카오 로그인이 성공적으로 수행되었습니다.');
                const newUser = new User({ snsId: profile.id });
                await newUser.save((err: Error) => {
                    if(err) {
                        console.log(err);
                    }
                });
                done(null, newUser);
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
};