import { Router } from 'express';
import billing from './billing';
import event from './event';
import eventJob from './eventJob';
import job from './job';
import member from './member';
import membership from './membership';
import workPoints from './workPoints';

const api = Router();

api.use('/member', member);
api.use('/membership', membership);
api.use('/event', event);
api.use('/job', job);
api.use('/workPoints', workPoints);
api.use('/eventJob', eventJob);
api.use('/billing', billing);

export default api;
