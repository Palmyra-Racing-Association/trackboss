import { rest } from 'msw';
import { setupServer } from 'msw/node';
import handlers from './handlers';
import memberHandlers from './memberHandlers';

// This configures a request mocking server with the given request handlers.
const server = setupServer(...memberHandlers, ...handlers);

export { server, rest };
