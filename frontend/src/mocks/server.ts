import { rest } from 'msw';
import { setupServer } from 'msw/node';
import workPointsHandlers from './workPointsHandlers';
import membershipHandlers from './membershipHandlers';
import jobTypeHandlers from './jobTypeHandlers';
import memberHandlers from './memberHandlers';
import eventTypeHandlers from './eventTypeHandlers';
import bikeHandlers from './bikeHandlers';
import billingHandlers from './billingHandlers';
import eventJobHandlers from './eventJobHandlers';
import eventHandlers from './eventHandlers';

// This configures a request mocking server with the given request handlers.
const server = setupServer(
    ...membershipHandlers,
    ...workPointsHandlers,
    ...memberHandlers,
    ...jobTypeHandlers,
    ...bikeHandlers,
    ...billingHandlers,
    ...eventTypeHandlers,
    ...eventJobHandlers,
    ...eventHandlers,
);

export { server, rest };
