import express from 'express';
import member from './Member';
import membership from './Membership';

const router = express.Router();

router.use('/member', member);
router.use('/membership', membership);

export default router;
