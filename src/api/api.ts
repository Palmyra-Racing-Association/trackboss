import { Request, Response, Router } from 'express';
import eventJob from './eventJob';
import member from './member';
import membership from './membership';

const api = Router();

api.use('/member', member);
api.use('/membership', membership);
api.use('/eventJob', eventJob);

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
