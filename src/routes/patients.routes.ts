import { Router, Request, Response } from 'express';
import PatientController from '../controllers/patients.controller';
import PatientRepository from '../repositories/patients.repository';
import PatientService from '../services/patients.service';
import UserRepository from '../repositories/user.repository';
import { JWT } from '../utils/jwt';
import {upload} from '../utils/multer'
import { AuthMiddleware } from '../middlewares/authMiddleware';
const patientsRouter = Router();
const patientRepository = new PatientRepository()
const patientService = new PatientService(patientRepository)
const patientController = new PatientController(patientService)
const jwt = new JWT()
const userRepository = new UserRepository()
const authMiddleware = new AuthMiddleware(userRepository, jwt)

patientsRouter.post('/', authMiddleware.authenticateJWT, upload.single('images'), patientController.createPatient);

patientsRouter.get('/:patientId', authMiddleware.authenticateJWT);

patientsRouter.patch('/:patientId', (req : Request, res : Response) => {

});

patientsRouter.delete('/:patientId', (req : Request, res : Response) => {

});

export default patientsRouter;