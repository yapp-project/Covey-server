import { Router } from 'express';

import { isLoggedIn } from './middleWares';
import { applyPost, cancelApply, findAllApplied } from '../controllers/applyController';

class ApplyRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes(): void {
        // 게시물 지원하기
        this.router.post('/:postId', applyPost);

        // req.user.id로 자신이 지원한 게시물 리스트 조회
        this.router.get('/appliedList', findAllApplied);
        
        // 지원 취소
        this.router.delete('/:postId', cancelApply);
    }
}
const applyRouter = new ApplyRouter();

/**
 * @swagger
 * tags:
 *   name: ApplyRouter
 *   description: 지원관련 api
 * /api/apply/{postId}:
 *   post:
 *     tags:
 *       - ApplyRouter
 *     summary: 게시물에 지원하기
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: 지원할 게시물 _id
 *         required: true
 *         type: stirng
 *     responses:
 *       201:
 *         description: 지원 성공
 *       400:
 *         description: 해당 아이디의 게시물이 존재하지않습니다.
 *       404:
 *         description: Not Found
 *   delete:
 *     tags:
 *       - ApplyRouter
 *     summary: 게시물에 지원 취소하기
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: 지원 취소할 게시물 _id
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: 삭제 성공
 *       404:
 *         description: Not Found
 * /api/apply/appliedList:
 *   get:
 *     tags:
 *       - ApplyRouter
 *     summary: 로그인된 사용자가 지원한 게시물 리스트 조회
 *     consumes:
 *       - application/json
 *     responses:
 *       200:
 *         description: 조회 성공
 *       404:
 *         description: Not Found
 */

export default applyRouter.router;