import { rest } from 'msw';
import { setupServer } from 'msw/node';
import eventHandlers from './eventHandlers';
import eventJobHandlers from './eventJobHandlers';
import eventTypeHandlers from './eventTypeHandlers';
import membershipHandlers from './membershipHandlers';
import jobHandlers from './jobHandlers';
import jobTypeHandlers from './jobTypeHandlers';
import workPointsHandlers from './workPointsHandlers';
import bikeHandlers from './bikeHandlers';
import billingHandlers from './billingHandlers';
import memberHandlers from './memberHandlers';

// This configures a request mocking server with the given request handlers.
const server = setupServer(
    ...eventTypeHandlers,
    ...eventJobHandlers,
    ...eventHandlers,
    ...membershipHandlers,
    ...memberHandlers,
    ...jobHandlers,
    ...jobTypeHandlers,
    ...workPointsHandlers,
    ...bikeHandlers,
    ...billingHandlers,
    ...eventTypeHandlers,
    ...eventJobHandlers,
    ...eventHandlers,
);

export { server, rest };
