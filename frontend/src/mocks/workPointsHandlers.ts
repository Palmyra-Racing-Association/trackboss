import { rest } from 'msw';

const workPointsHandlers = [
    // byMemberShip
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMembership/:memberShipId`, (req, res, ctx) => {
        const { memberShipId } = req.params;
        if (memberShipId === '1') {
            return res(ctx.status(200), ctx.json({ total: 3 }));
        } if (memberShipId === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        } if (memberShipId === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (memberShipId === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),
    // byMember
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMember/:memberId`, (req, res, ctx) => {
        const { memberId } = req.params;
        if (memberId === '1') {
            return res(ctx.status(200), ctx.json({ total: 5 }));
        } if (memberId === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        } if (memberId === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (memberId === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),
];

export default workPointsHandlers;
