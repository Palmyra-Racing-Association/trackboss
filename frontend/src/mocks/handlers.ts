import { rest } from 'msw';

const handlers = [
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMembership/1`, (req, res, ctx) => {
        const response = res(ctx.status(200), ctx.json({ total: 3 }));
        return response;
    }),
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMembership/-1`, (req, res, ctx) => {
        const response = res(ctx.status(400));
        return response;
    }),
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMember/1`, (req, res, ctx) => {
        const response = res(ctx.status(200), ctx.json({ total: 5 }));
        return response;
    }),
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMember/-1`, (req, res, ctx) => {
        const response = res(ctx.status(400));
        return response;
    }),
];

export { handlers as default };
