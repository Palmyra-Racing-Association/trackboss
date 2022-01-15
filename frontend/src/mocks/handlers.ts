import { rest } from 'msw';

const handlers = [
    // Handles a GET request
    rest.get('http://localhost:8080/api/workPoints/byMembership/1', (req, res, ctx) => {
        const response = res(ctx.status(200), ctx.json({ total: 3 }));
        return response;
    }),
];

// eslint-disable-next-line import/prefer-default-export
export { handlers };
