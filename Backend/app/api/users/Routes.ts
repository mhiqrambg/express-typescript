import express from 'express';
import { Users } from './Controllers';
import { ValUsers } from './UserValidator';
import { GlobalValidation } from '../../middleware/validationGlobal';
import { authenticateToken } from '../../middleware/authenticateToken';


const router = express.Router();

router.get('/users', Users.get);
router.get('/users/:id', Users.one);
router.post('/users', GlobalValidation(ValUsers),authenticateToken, Users.create);
router.put('/users/:id', GlobalValidation(ValUsers),authenticateToken, Users.update);
router.delete('/users/:id', Users.remove);

export default router;
