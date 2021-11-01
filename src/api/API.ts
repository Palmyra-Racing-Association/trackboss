import express, { Request, Response } from 'express';
import member from './Member';
import membership from './Membership';

const router = express.Router();

router.use('/member', member);
router.use('/membership', membership);

router.get('/members', (req: Request, res: Response) => {
    res.status(501).send();
});

router.get('/memberships', (req: Request, res: Response) => {
    res.status(501).send();
});

router.post('/newMember', (req: Request, res: Response) => {
    res.status(501).send();
});

router.post('/newMembership', (req: Request, res: Response) => {
    res.status(501).send();
});

export default router;
