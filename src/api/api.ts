import { Router } from 'express';
import bike from './bike';
import billing from './billing';
import event from './event';
import eventJob from './eventJob';
import eventType from './eventType';
import job from './job';
import jobType from './jobType';
import member from './member';
import membership from './membership';
import memberType from './memberType';
import workPoints from './workPoints';

const api = Router();

api.use('/member', member);
api.use('/memberType', memberType);
api.use('/membership', membership);
api.use('/bike', bike);
api.use('/event', event);
api.use('/eventType', eventType);
api.use('/job', job);
api.use('/jobType', jobType);
api.use('/workPoints', workPoints);
api.use('/eventJob', eventJob);
api.use('/billing', billing);

export default api;
