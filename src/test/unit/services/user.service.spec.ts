import UserRepository from "../../../repositories/user.repository";
import JWT from "../../../utils/jwt";
import UserService from "../../../services/user.service";
import {
  loginInput,
  loginOutput,
  findUserByIdResult,
} from "../fixtures/user.fixtures";
import jwtContainer from "../../../container/jwt.container";
import userServiceContainer from "../../../container/user.service.container";
import userRepositoryContainer from "../../../container/user.repository.container";
import userRepository from "../../../repositories/user.repository";
import { Container } from "typedi";

const mockUserRepository = {
  findUserById: jest.fn(),
  findUserByToken: jest.fn(),
  updateRefreshToken: jest.fn(),
  deleteRefreshToken: jest.fn(),
  runQuery: jest.fn()
};

describe("UserService", () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let jwt: JWT;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  test("login Method Success Case", async () => {
    const jwt = new JWT()
    const userRepository = new UserRepository()
    const userService = new UserService();
    // userService.userRepository = Object.assign(
    //   {},
    //   mockUserRepository
    // );

    const user = findUserByIdResult
    const {id, pw} = loginInput;

    userRepository.findUserById = jest.fn().mockReturnValueOnce({
        userId: id,
        password: pw,
      });

    const loginResult = await userService.login(id, pw)

    expect(userService.login).toHaveBeenCalledWith(id, pw);

    // login 메소드는 몇번 호출되었는지
    expect(userService.login).toHaveBeenCalledTimes(1);

    expect(userService.login).toBe(loginResult)
  });

  
});
