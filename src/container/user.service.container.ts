import { Container } from 'typedi';
import UserService from '../services/user.service';

const userServiceContainer = Container.of();
userServiceContainer.set('userService', new UserService());

export default userServiceContainer;