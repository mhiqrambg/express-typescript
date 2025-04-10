
import express from 'express';
import {Users} from "./Controllers";
import {ValUsers} from "./UserValidator"
import {ValGlobal} from '../../middleware/handleValidationGlobal';

const router = express.Router();


router.get('/users', Users.get);
router.get('/users/:id', Users.one);
router.post('/users', ValUsers, ValGlobal, Users.create);
router.put('/users/:id', ValUsers, ValGlobal, Users.update);


export default router;
