import { Request, Response, Router } from 'express';
import { checkHeader, verify } from '../util/auth';
import { GetMemberTypeListResponse, GetMemberTypeResponse, MemberType } from '../typedefs/memberType';
import { getMemberType, getMemberTypeList } from '../database/memberType';

const memberType = Router();

memberType.get('/list', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetMemberTypeListResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const memberTypeList: MemberType[] = await getMemberTypeList();
            res.status(200);
            response = memberTypeList;
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

memberType.get('/:memberTypeID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetMemberTypeResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { memberTypeID } = req.params;
            response = await getMemberType(Number(memberTypeID));
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

memberType.patch('/:memberTypeID', (req: Request, res: Response) => {
    res.status(501).send();
});

export default memberType;
