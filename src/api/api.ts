import { Request, Response, Router } from 'express';
import billing from './billing';
import eventJob from './eventJob';
import member from './member';
import membership from './membership';

const api = Router();

api.use('/billing', billing);
api.use('/eventJob', eventJob);
api.use('/member', member);
api.use('/membership', membership);

api.get('/members', (req: Request, res: Response) => {
    res.status(501).send();
});

api.get('/memberships', (req: Request, res: Response) => {
    res.status(501).send();
});

api.post('/newMember', (req: Request, res: Response) => {
    res.status(501).send();
});

api.post('/newMembership', (req: Request, res: Response) => {
    res.status(501).send();
});

export default api;
