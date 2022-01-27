import { rest } from 'msw';
import { setupServer } from 'msw/node';
import workPointsHandlers from './workPointsHandlers';
import membershipHandlers from './membershipHandlers';
import jobTypeHandlers from './jobTypeHandlers';

// This configures a request mocking server with the given request handlers.
const server = setupServer(...membershipHandlers, ...workPointsHandlers, ...jobTypeHandlers);

export { server, rest };
