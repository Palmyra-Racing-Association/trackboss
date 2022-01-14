import { rest } from 'msw';

const handlers = [
    // Handles a GET request
    rest.get('http://localhost:8080/api/workPoints/byMembership/1', (req, res, ctx) => {
        const response = res(ctx.status(200), ctx.json({ total: 3 }));
        // The response looks good here, but not in the test
        return response;
    }),
];

// eslint-disable-next-line import/prefer-default-export
export { handlers };
