import { Router } from 'express';
import userRouter from './user.routes';
import migrantRouter from './migrant.routes';

const routes = Router()

routes.use('/user', userRouter)
routes.use('/migrant', migrantRouter)

export default routes;