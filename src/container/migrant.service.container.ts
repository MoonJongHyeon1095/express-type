import { Container } from 'typedi';
import MigrantService from '../services/migrant.service';

const migrantServiceContainer = Container.of();
migrantServiceContainer.set('migrantService', new MigrantService());

export default migrantServiceContainer;