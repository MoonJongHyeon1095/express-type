import { Router } from 'express';
import userRouter from './user.routes';
import patientsRouter from './patients.routes';

const routes = Router()

routes.use('/api/v1/user', userRouter)
routes.use('/api/v1/patients', patientsRouter)

export default routes;