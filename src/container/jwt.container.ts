import { Container } from 'typedi';
import JWT from "../utils/jwt";

const jwtContainer = Container.of();
jwtContainer.set('jwt', new JWT());

export default jwtContainer;