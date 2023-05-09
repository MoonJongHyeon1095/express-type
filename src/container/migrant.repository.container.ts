import { Container } from 'typedi';
import MigrantRepository from '../repositories/migrant.repository';

const migrantRepositoryContainer = Container.of();
migrantRepositoryContainer.set('migrantRepository', new MigrantRepository());

export default migrantRepositoryContainer;