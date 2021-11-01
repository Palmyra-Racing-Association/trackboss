import { Request, Response, Router } from 'express';
import member from './member';
import membership from './membership';

const router = Router();

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
