import UserController from "../../../controllers/user.controller";
import UserRepository from "../../../repositories/user.repository";
import JWT from "../../../utils/jwt";
import UserService from "../../../services/user.service";
import {
  loginInput,
  loginOutput,
} from "../fixtures/user.fixtures";
import { InvalidParamsError } from "../../../utils/exceptions";
import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";

jest.mock("../../../services/user.service");
jest.mock("../../../repositories/user.repository");
jest.mock("../../../utils/jwt");

const mockUserService = () => ({
    login: jest.fn(),
    logout: jest.fn(),
  });

let mockRequest = {
  body: jest.fn(),
} as Request

let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
  send: jest.fn(),
  cookie: jest.fn(),
} as unknown as Response;

describe("UserController", () => {
  let userController: UserController;
  let userService: UserService;
  let userRepository: UserRepository;
  let jwt: JWT;
  let req: Request;
  let res: Response;
  let next: NextFunction;

jwt = new JWT();
userRepository = new UserRepository();
Container.set(UserService, new UserService());
userService = Container.get(UserService)
// userService = new UserService()
userController = new UserController();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("login Method Success Case", async () => {
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });

    mockRequest  = {
      body : loginInput
    } as Request

    const tokenData = loginOutput;

    jest.spyOn(userService, "login").mockResolvedValue(tokenData);
    // userService.login = jest.fn(()=>{
    //   return tokenData
    // });
    await userController.login(mockRequest, mockResponse, next);

    expect(userService.login).toHaveBeenCalledWith(mockRequest.body.id, mockRequest.body.pw);

    // login 메소드는 몇번 호출되었는지
    expect(userService.login).toHaveBeenCalledTimes(1);

    // login status는 몇번 호출되는가
    expect(res.status).toHaveBeenCalledTimes(1);

    // login status의 반환값은 무엇인가
    expect(res.status).toHaveBeenCalledWith(200);

    // login cookie 반환값은 무엇인가
    expect(res.cookie).toHaveBeenCalledWith(
      "accesstoken",
      `Bearer ${tokenData.accesstoken}`
    );

    expect(res.cookie).toHaveBeenCalledWith(
      "refreshtoken",
      `Bearer ${tokenData.refreshtoken}`
    );
  });

  test("login Failed Case By ParamsError", async () => {
    mockRequest.body.id = null;
    mockRequest.body.pw = null;

    const expectedError = '아이디나 비밀번호를 입력해주십시오';
    jest.spyOn(userService, 'login').mockRejectedValue(expectedError);
    await userController.login(mockRequest, mockResponse, next);
    // createUser 메소드는 몇번 호출되었는지
    expect(userService.login).toHaveBeenCalledTimes(0);

    // createUser status의 반환값은 무엇인가.
    expect(mockResponse.status).toHaveBeenCalledWith(400);

    // createUser send의 반환값은 무엇인가.
    expect(res.json).toHaveBeenCalledWith({"message": expectedError});
  });
});
