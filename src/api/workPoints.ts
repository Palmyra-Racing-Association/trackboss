import { Request, Response, Router } from 'express';
import _ from 'lodash';
import { getWorkPointsByMember, getWorkPointsByMembership } from 'src/database/workPoints';
import { GetMemberWorkPointsResponse } from 'src/typedefs/workPoints';
import { checkHeader, verify } from '../util/auth';

const YEAR_NAN_MSG = 'year must be a number';

const workPoints = Router();

type ParsedInputs = { id: number, year: number };

function parseInputs(idString: string, yearString: string): ParsedInputs {
    const id = Number(idString);
    if (Number.isNaN(id)) {
        throw new Error('not found');
    }

    let year;
    if (typeof yearString !== 'undefined') {
        year = Number(yearString);
        if (_.isNaN(year)) {
            throw new Error(YEAR_NAN_MSG);
        }
    } else {
        // no query param -> default to current year
        year = new Date().getFullYear();
    }

    return { id, year };
}

workPoints.get('/byMember/:memberID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetMemberWorkPointsResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { id, year } = parseInputs(req.params.memberID, String(req.query.year));
            response = await getWorkPointsByMember(id, year);
            res.status(200);
        } catch (e: any) {
            switch (e.message) {
                case YEAR_NAN_MSG:
                    res.status(400);
                    response = { reason: YEAR_NAN_MSG };
                    break;
                case 'Authorization Failed':
                    res.status(401);
                    response = { reason: 'not authorized' };
                    break;
                case 'not found':
                    res.status(404);
                    response = { reason: 'not found' };
                    break;
                default:
                    res.status(500);
                    response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

workPoints.get('/byMembership/:membershipID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetMemberWorkPointsResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { id, year } = parseInputs(req.params.memberID, String(req.query.year));
            response = await getWorkPointsByMembership(id, year);
            res.status(200);
        } catch (e: any) {
            switch (e.message) {
                case YEAR_NAN_MSG:
                    res.status(400);
                    response = { reason: YEAR_NAN_MSG };
                    break;
                case 'Authorization Failed':
                    res.status(401);
                    response = { reason: 'not authorized' };
                    break;
                case 'not found':
                    res.status(404);
                    response = { reason: 'not found' };
                    break;
                default:
                    res.status(500);
                    response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

export default workPoints;
