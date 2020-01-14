import { Strategy } from 'passport-facebook';
import { PassportStatic } from 'passport';
import { Error } from 'mongoose';

import { User } from '../models/User';
import { FACEBOOK_ID, FACEBOOK_SECRET } from '../config/secret';


export const facebook = (passport: PassportStatic) => {
    passport.use(new Strategy({
        clientID: FACEBOOK_ID,
        clientSecret: FACEBOOK_SECRET,
        callbackURL: '/api/auth/facebook/callback',
    }, async (accessToken, refreshToken, profile, done)=>{
        try {
            console.log('facebook 로그인 전략 수행 시작');
            const exUser = await User.findOne({ snsId: profile.id }, (err: Error) => {
                if(err) {
                    console.log(err);
                }
            });
            if (exUser) {
                console.log('이미 해당 페이스북 아이디로 가입된 유저가 존재합니다.');
                done(null, exUser);
            } else {
                console.log('페이스북 로그인이 성공적으로 수행되었습니다.');
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