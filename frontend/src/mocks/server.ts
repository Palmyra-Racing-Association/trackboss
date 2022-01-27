import { rest } from 'msw';
import { setupServer } from 'msw/node';
import workPointsHandlers from './workPointsHandlers';
import membershipHandlers from './membershipHandlers';
import jobTypeHandlers from './jobTypeHandlers';
import memberHandlers from './memberHandlers';
import bikeHandlers from './bikeHandlers';

// This configures a request mocking server with the given request handlers.
const server = setupServer(
    ...membershipHandlers,
    ...workPointsHandlers,
    ...memberHandlers,
    ...jobTypeHandlers,
    ...bikeHandlers,
);

export { server, rest };
