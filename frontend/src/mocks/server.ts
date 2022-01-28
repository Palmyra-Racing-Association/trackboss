import { rest } from 'msw';
import { setupServer } from 'msw/node';
import bikeHandlers from './bikeHandlers';
import eventHandlers from './eventHandlers';
import eventJobHandlers from './eventJobHandlers';
import eventTypeHandlers from './eventTypeHandlers';
import memberHandlers from './memberHandlers';
import membershipHandlers from './membershipHandlers';
import jobHandlers from './jobHandlers';
import jobTypeHandlers from './jobTypeHandlers';
import workPointsHandlers from './workPointsHandlers';
import bikeHandlers from './bikeHandlers';
import memberHandlers from './memberHandlers;

// This configures a request mocking server with the given request handlers.
const server = setupServer(
    ...bikeHandlers,
    ...eventTypeHandlers,
    ...eventJobHandlers,
    ...eventHandlers,
    ...membershipHandlers,
    ...memberHandlers,
    ...jobHandlers,
    ...jobTypeHandlers,
    ...workPointsHandlers,
    ...bikeHandlers,
    ...memberHandlers,
);

export { server, rest };
