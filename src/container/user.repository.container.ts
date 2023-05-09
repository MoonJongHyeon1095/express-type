import { Container } from 'typedi';
import UserRepository from '../repositories/user.repository';

const userRepositoryContainer = Container.of();
userRepositoryContainer.set('userRepository', new UserRepository());

export default userRepositoryContainer;