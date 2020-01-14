import { PassportStatic } from 'passport';

import { kakao } from './kakaoStrategy';
import { facebook } from './facebookStrategy';
import { User, UserDocument } from '../models/User';

export const passportConfig = (passport: PassportStatic) => {

    passport.serializeUser((user: UserDocument, done) => {
        console.log('-------------serialize');
        done(null, user._id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            console.log('-------------deserialize');
            done(null, user);
        });
    });

  kakao(passport);
  facebook(passport);
};
