import { Router } from 'express';
import billing from './billing';
import eventJob from './eventJob';
import member from './member';
import membership from './membership';

const api = Router();

api.use('/member', member);
api.use('/membership', membership);
api.use('/eventJob', eventJob);
api.use('/billing', billing);

export default api;
