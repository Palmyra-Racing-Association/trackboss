import { rest } from 'msw';
import { setupServer } from 'msw/node';
import workPointsHandlers from './workpointsHandlers';
import membershipHandlers from './membershipHandlers';

// This configures a request mocking server with the given request handlers.
const server = setupServer(...workPointsHandlers, ...membershipHandlers);

export { server, rest };
