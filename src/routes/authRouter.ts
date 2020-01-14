import { Router } from 'express';
import passport from 'passport';

import { isNotLoggedIn, isLoggedIn } from './middleWares';
import { logout, sendCodeToPhone, verifyCode } from '../controllers/authController';

class AuthRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes(): void {
        this.router.get('/kakao', isNotLoggedIn, passport.authenticate('kakao'));
        this.router.get('/kakao/callback', 
                            isNotLoggedIn, 
                            passport.authenticate('kakao', {failureRedirect:'/api/auth/kakao' }), 
                            (req, res) => { res.status(201).json(req.user); });
        this.router.get('/facebook', isNotLoggedIn, passport.authenticate('facebook'));
        this.router.get('/facebook/callback', 
                            isNotLoggedIn, 
                            passport.authenticate('facebook', {failureRedirect:'/api/auth/facebook'}), 
                            (req, res) => { res.status(201).json(req.user); });
        this.router.get('/logout', isLoggedIn, logout);
        this.router.post('/phone', isLoggedIn, sendCodeToPhone);
        this.router.post('/verify', isLoggedIn, verifyCode);
    }
}

const authRouter = new AuthRouter();

/**
 * @swagger
 * tags:
 *   name: AuthRouter
 *   description: 회원가입 & 로그인관련 api
 * /api/auth/kakao:
 *   get:
 *     tags:
 *       - AuthRouter
 *     summary: 카카오 회원가입
 *     consumes:
 *       - application/json
 *     responses:
 *       200:
 *         description: 회원가입 및 로그인 성공
 *       404:
 *         description: Not Found
 * /api/auth/facebook:
 *   get:
 *     tags:
 *       - AuthRouter
 *     summary: 페이스북 회원가입
 *     consumes:
 *       - application/json
 *     responses:
 *       200:
 *         description: 회원가입 및 로그인 성공
 *       404:
 *         description: Not Found
 * /api/auth/logout:
 *   get:
 *     tags:
 *       - AuthRouter
 *     summary: 로그아웃하기
 *     consumes:
 *       - application/json
 *     responses:
 *       204:
 *         description: 로그아웃 성공
 *       403:
 *         description: 로그인 필요
 *       404:
 *         description: Not Found
 * /api/auth/phone:
 *   post:
 *     tags:
 *       - AuthRouter
 *     summary: 폰번호로 인증번호 발송
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: |
 *           핸드폰 번호를 json형식으로 request body에 넣어줘야함.
 *           {
 *              "phoneNum" : "01092988726"
 *           }
 *         required: true
 *     responses:
 *       201:
 *         description: 인증번호 발송 성공
 *       404:
 *         description: Not Found
 * /api/auth/verify:
 *   post:
 *     tags:
 *       - AuthRouter
 *     summary: 인증번호 인증하기
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: |
 *           핸드폰 번호와 인증번호를 json형식으로 request body에 넣어줘야함.
 *           {
 *              "phoneNum" : "01092988726",
 *              "verifyNumFromClient" : 4561237858
 *           }
 *         required: true
 *     responses:
 *       201:
 *         description: 인증 성공
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: Not Found
 */

export default authRouter.router;