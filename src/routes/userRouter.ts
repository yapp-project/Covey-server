import { Router } from 'express';
import fs from 'fs';

import { upload, isLoggedIn } from './middleWares';
import { findUser, findApplicant, findAuthorizedUser, modifyUser, deleteUser } from '../controllers/userController';

class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
        this.config();
    }
    private config(): void {
        fs.readdir('uploads', (err) => {
            if (err) {
                console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
                fs.mkdirSync('uploads');
            }
        });
    }
    private routes(): void {
        this.router.get('/', findAuthorizedUser);
        this.router.get('/applicants/:postId', findApplicant);
        this.router.get('/others/:userId', findUser);
        this.router.put('/', upload.single('img'), modifyUser);
        this.router.delete('/', deleteUser);
    }
}
const userRouter = new UserRouter();

/**
 * @swagger
 * tags:
 *   name: UserRouter
 *   description: 사용자 관련 api
 * /api/user:
 *   get:
 *     tags:
 *       - UserRouter
 *     summary: 로그인된 사용자의 프로필 정보 조회
 *     consumes:
 *       - application/json
 *     responses:
 *       200:
 *         description: 조회 성공
 *       404:
 *         description: Not Found
 *   put:
 *     tags:
 *       - UserRouter
 *     summary: 로그인된 사용자의 프로필 정보 수정
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: |
 *           프로필 정보 수정할 때 request body에 넣어줘야할 json
 *           1. 수정하려는 내용의 key만 선별해서 json작성
 *           2. id, snsId, img,  phoneNum 이렇게 4개 key들은 body에서 제외해야함.
 *           3. address1는 시/도, address2는 구/시 (ex:서울특별시 / 중랑구)
 *           6. img key의 value는 postman에서 request보낼 때 body form-data에서 file형식으로 전송
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       201:
 *         description: 수정 성공
 *       422:
 *         description: 잘못된 형식의 request body
 *       404:
 *         description: Not Found
 *   delete:
 *     tags:
 *       - UserRouter
 *     summary: 로그인된 사용자의 회원탈퇴
 *     consumes:
 *       - application/json
 *     responses:
 *       204:
 *         description: 삭제 성공
 *       404:
 *         description: Not Found
 * /api/user/applicants/{postId}:
 *   get:
 *     tags:
 *       - UserRouter
 *     summary: 게시물에 지원한 사용자들의 이름과 핸드폰 번호의 리스트 조회
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: 게시물 번호
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: 게시자의 조회 성공
 *       204:
 *         description: 비게시자의 조회 성공
 *       404:
 *         description: Not Found
 * /api/user/others/{userId}:
 *   get:
 *     tags:
 *       - UserRouter
 *     summary: 지원자 or 게시자의 프로필 정보 조회
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: 사용자 번호
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: 조회 성공
 *       404:
 *         description: Not Found
 */

export default userRouter.router;