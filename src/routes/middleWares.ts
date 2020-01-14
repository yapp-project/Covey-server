import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

export const isLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).json({ message : '로그인 필요' });
    }
};

export const isNotLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.status(403).json({ message : '이미 로그인되어 있습니다.' });
    }
};


export const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        }
    }),
});