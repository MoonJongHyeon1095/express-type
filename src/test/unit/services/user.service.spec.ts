import { Container } from 'typedi';
import UserService from '../../../services/user.service';
import UserRepository from '../../../repositories/user.repository';
import JWT from '../../../utils/jwt';
import { InvalidAccessError } from '../../../utils/exceptions';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let jwt: JWT;

  beforeEach(() => {
    // Mock UserRepository and JWT using typedi Container
    Container.set('userRepository', {
      findUserById: jest.fn(),
      updateRefreshToken: jest.fn(),
      deleteRefreshToken: jest.fn(),
    });
    Container.set('jwt', {
      access: jest.fn(),
      refresh: jest.fn(),
    });

    userService = new UserService();
    userRepository = Container.get<UserRepository>('userRepository');
    jwt = Container.get<JWT>('jwt');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access token and refresh token when user credentials are valid', async () => {
      const user = { nickname: 'test', password: 'test' };
      const accessToken = 'access_token';
      const refreshToken = 'refresh_token';

      // Mock UserRepository to return the test user
      (userRepository.findUserById as jest.Mock).mockResolvedValueOnce(user);

      // Mock JWT to return the test tokens
      (jwt.access as jest.Mock).mockReturnValueOnce(accessToken);
      (jwt.refresh as jest.Mock).mockReturnValueOnce(refreshToken);

      // Call login method with test user credentials
      const result = await userService.login('test', 'test');

      // Check that UserRepository and JWT methods were called correctly
      expect(userRepository.findUserById).toHaveBeenCalledTimes(1);
      expect(userRepository.findUserById).toHaveBeenCalledWith('test');
      expect(jwt.access).toHaveBeenCalledTimes(1);
      expect(jwt.access).toHaveBeenCalledWith(user);
      expect(jwt.refresh).toHaveBeenCalledTimes(1);

      // Check that the returned result is correct
      expect(result.accesstoken).toBe(accessToken);
      expect(result.refreshtoken).toBe(refreshToken);
      expect(result.accesstokenExp).toBe('2시간');
      expect(result.refreshtokenExp).toBe('1일');
    });

    it('should throw an InvalidAccessError when user credentials are invalid', async () => {
      // Mock UserRepository to return undefined (no user found)
      (userRepository.findUserById as jest.Mock).mockResolvedValueOnce(undefined);

      // Call login method with invalid user credentials
      await expect(userService.login('test', 'invalid_password')).rejects.toThrow(InvalidAccessError);

      // Check that UserRepository and JWT methods were not called
      expect(userRepository.findUserById).toHaveBeenCalledTimes(1);
      expect(jwt.access).not.toHaveBeenCalled();
      expect(jwt.refresh).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call deleteRefreshToken method of UserRepository', async () => {
      // Call logout method with test user ID
      await userService.logout(1);

      // Check that UserRepository method was called correctly
      expect(userRepository.deleteRefreshToken).toHaveBeenCalledTimes(1);
      expect(userRepository.deleteRefreshToken).toHaveBeenCalledWith(1);
    });
  });
});
