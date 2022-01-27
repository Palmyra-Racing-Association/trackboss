import { rest } from 'msw';
import { setupServer } from 'msw/node';
import workPointsHandlers from './workPointsHandlers';
import membershipHandlers from './membershipHandlers';
import jobTypeHandlers from './jobTypeHandlers';
import memberHandlers from './memberHandlers';
import bikeHandlers from './bikeHandlers';
import jobHandlers from './jobHandlers';

// This configures a request mocking server with the given request handlers.
const server = setupServer(
    ...membershipHandlers,
    ...workPointsHandlers,
    ...bikeHandlers,
    ...memberHandlers,
    ...jobHandlers,
    ...memberHandlers,
    ...jobTypeHandlers,
    ...bikeHandlers,
);

export { server, rest };
