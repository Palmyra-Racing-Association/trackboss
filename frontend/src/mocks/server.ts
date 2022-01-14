// src/mocks/server.js
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// This configures a request mocking server with the given request handlers.
const server = setupServer(...handlers);

// eslint-disable-next-line import/prefer-default-export
export { server, rest };
