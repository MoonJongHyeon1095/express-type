import { Router, Request, Response } from 'express';
import MigrantController from '../controllers/migrant.controller';
import MigrantRepository from '../repositories/migrant.repository';
import Migrantervice from '../services/migrant.service';
import UserRepository from '../repositories/user.repository';
import JWT from '../utils/jwt';
import {upload} from '../utils/multer'
import { AuthMiddleware } from '../middlewares/authMiddleware';
const migrantRouter = Router();
const migrantRepository = new MigrantRepository()
const migrantervice = new Migrantervice()
const migrantController = new MigrantController()
const jwt = new JWT()
const userRepository = new UserRepository()
const authMiddleware = new AuthMiddleware()

migrantRouter.post('/', authMiddleware.authenticateJWT,upload.single('image'), upload.fields([{name: 'imageUrl'}, {name: 'imageTxt'}]), migrantController.createMigrant);

migrantRouter.get('/:migrantId', authMiddleware.authenticateJWT);

migrantRouter.patch('/:migrantId', (req : Request, res : Response) => {

});

migrantRouter.delete('/:migrantId', (req : Request, res : Response) => {

});

export default migrantRouter;