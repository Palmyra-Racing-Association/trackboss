import { rest } from 'msw';

const handlers = [
    rest.get('http://localhost:8080/api/workPoints/byMembership/1', (req, res, ctx) => {
        const response = res(ctx.status(200), ctx.json({ total: 3 }));
        return response;
    }),
    rest.get('http://localhost:8080/api/workPoints/byMembership/-1', (req, res, ctx) => {
        const response = res(ctx.status(400));
        return response;
    }),
    rest.get('http://localhost:8080/api/workPoints/byMember/1', (req, res, ctx) => {
        const response = res(ctx.status(200), ctx.json({ total: 5 }));
        return response;
    }),
    rest.get('http://localhost:8080/api/workPoints/byMember/-1', (req, res, ctx) => {
        const response = res(ctx.status(400));
        return response;
    }),
];

export { handlers as default };
