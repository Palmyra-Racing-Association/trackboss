import { Request, Response, Router } from 'express';
import {
    deleteBoardMemberType,
    getBoardMemberType,
    getBoardMemberTypeList,
    insertBoardMemberType,
    patchBoardMemberType,
} from '../database/boardMemberType';
import {
    BoardMemberType,
    DeleteBoardMemberTypeResponse,
    GetBoardMemberTypeListResponse,
    GetBoardMemberTypeResponse,
    PatchBoardMemberTypeResponse,
    PostNewBoardMemberTypeResponse,
} from '../typedefs/boardMemberType';
import { checkHeader, verify } from '../util/auth';

const boardMemberType = Router();

boardMemberType.post('/new', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PostNewBoardMemberTypeResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token, 'Admin');
            const insertId = await insertBoardMemberType(req.body);
            response = await getBoardMemberType(insertId);
            res.status(201);
        } catch (e: any) {
            if (e.message === 'user input error') {
                res.status(400);
                response = { reason: 'bad request' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'Forbidden') {
                res.status(403);
                response = { reason: 'forbidden' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

boardMemberType.get('/list', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetBoardMemberTypeListResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const memberList: BoardMemberType[] = await getBoardMemberTypeList();
            res.status(200);
            response = memberList;
        } catch (e: any) {
            if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

boardMemberType.get('/:boardMemberId', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetBoardMemberTypeResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { boardMemberId } = req.params;
            const id = Number(boardMemberId);
            if (Number.isNaN(id)) {
                throw new Error('not found');
            }
            response = await getBoardMemberType(id);
            res.status(200);
        } catch (e: any) {
            if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

boardMemberType.patch('/:boardMemberId', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PatchBoardMemberTypeResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            const { boardMemberId } = req.params;
            const id = Number(boardMemberId);
            if (Number.isNaN(id)) {
                throw new Error('not found');
            }
            await verify(headerCheck.token, 'Admin');
            await patchBoardMemberType(id, req.body);
            response = await getBoardMemberType(id);
            res.status(200);
        } catch (e: any) {
            if (e.message === 'user input error') {
                res.status(400);
                response = { reason: 'bad request' };
            } else if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'Forbidden') {
                res.status(403);
                response = { reason: 'forbidden' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

boardMemberType.delete('/:boardMemberId', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: DeleteBoardMemberTypeResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            const { boardMemberId } = req.params;
            const id = Number(boardMemberId);
            if (Number.isNaN(id)) {
                throw new Error('not found');
            }
            await verify(headerCheck.token, 'Admin');
            await deleteBoardMemberType(id);
            response = { boardMemberTypeId: id };
            res.status(200);
        } catch (e: any) {
            if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'Forbidden') {
                res.status(403);
                response = { reason: 'forbidden' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

export default boardMemberType;
