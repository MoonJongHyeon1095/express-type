import { Router } from 'express';
import userRouter from './user.routes';
import migrantRouter from './migrant.routes';

const routes = Router()

routes.use('/api/v1/user', userRouter)
routes.use('/api/v1/migrant', migrantRouter)

export default routes;