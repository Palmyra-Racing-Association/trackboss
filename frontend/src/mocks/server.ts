import { rest } from 'msw';
import { setupServer } from 'msw/node';
import workPointsHandlers from './workPointsHandlers';
import membershipHandlers from './membershipHandlers';
import memberHandlers from './memberHandlers';
import bikeHandlers from './bikeHandlers';

// This configures a request mocking server with the given request handlers.
const server = setupServer(...membershipHandlers, ...workPointsHandlers, ...bikeHandlers, ...memberHandlers);

export { server, rest };
