import UserController from "../../../controllers/user.controller";
import UserRepository from "../../../repositories/user.repository";
import JWT from "../../../utils/jwt";
import UserService from "../../../services/user.service";
import {
  loginInput,
  loginOutput,
} from "../fixtures/user.fixtures";
import { InvalidAccessError, InvalidParamsError } from "../../../utils/exceptions";
import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";

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
  // const mockUserService = <jest.Mock<UserService>>UserService;
  // const mockJWT = <jest.Mock<JWT>>JWT;
  // let userService = new mockUserService()
  // let jwt = new mockJWT()
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let userController: UserController;
  let userService: UserService;


  beforeEach(() => {
    Container.set('userService', {
      login: jest.fn(),
      logout: jest.fn(),
    });
    userController = new UserController()
    userService = Container.get<UserService>('userService')
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

    (userService.login as jest.Mock).mockResolvedValue(tokenData)
    await userController.login(mockRequest, mockResponse, next);

    expect(userService.login).toHaveBeenCalledWith(mockRequest.body.id, mockRequest.body.pw);

    // login 메소드는 몇번 호출되었는지
    expect(userService.login).toHaveBeenCalledTimes(1);

    // login status는 몇번 호출되는가
    expect(mockResponse.status).toHaveBeenCalledTimes(1);

    // login status의 반환값은 무엇인가
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // login cookie 반환값은 무엇인가
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      "accesstoken",
      `Bearer ${tokenData.accesstoken}`
    );

    expect(mockResponse.cookie).toHaveBeenCalledWith(
      "refreshtoken",
      `Bearer ${tokenData.refreshtoken}`
    );

    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "success",
      data: tokenData,
    });
  });

  test("login Failed Case By ParamsError", async () => {
    mockRequest.body.id = null;
    mockRequest.body.pw = null;

    const expectedError = '아이디나 비밀번호를 입력해주십시오';
    jest.spyOn(userService, 'login').mockRejectedValue(new InvalidParamsError(expectedError));
    // (userService.login as jest.Mock).mockResolvedValueOnce(undefined)
    await userController.login(mockRequest, mockResponse, next)
    
    // createUser 메소드는 몇번 호출되었는지
    expect(userService.login).toHaveBeenCalledTimes(0);

    // createUser status의 반환값은 무엇인가.
    expect(mockResponse.status).toHaveBeenCalledWith(400);

    // createUser send의 반환값은 무엇인가.
    expect(mockResponse.json).toHaveBeenCalledWith({"message": expectedError});
  });

  test("should return 400 status code with error message when login fails due to invalid credentials", async () => {
    // given
    mockRequest.body = { id: "wrong", pw: "wrong" };
    const expectedError = "Invalid credentials";
    jest.spyOn(userService, "login").mockRejectedValue(new InvalidAccessError(expectedError));

    // when
    await userController.login(mockRequest, mockResponse, jest.fn());

    // then
    expect(userService.login).toHaveBeenCalledWith("wrong", "wrong");
    expect(userService.login).toHaveBeenCalledTimes(1);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: expectedError,
    });
  });

  test("logout Method Success Case", async () => {
    const userId = 1;

    // Mock the logged-in user ID in the response locals
    (mockResponse as any).locals = { user: { userId } };

    // Mock the userService.logout method
    (userService.logout as jest.Mock).mockResolvedValue(undefined);

    await userController.logout(mockRequest, mockResponse, next);

    expect(userService.logout).toHaveBeenCalledWith(userId);

    // logout 메소드는 몇번 호출되었는지
    expect(userService.logout).toHaveBeenCalledTimes(1);

    // logout status는 몇번 호출되는가
    expect(mockResponse.status).toHaveBeenCalledTimes(1);

    // logout status의 반환값은 무엇인가
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // logout json 반환값은 무엇인가
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "success",
    });
  });

  test("logout Failed Case", async () => {
    const userId = 1;

    // Mock the logged-in user ID in the response locals
    (mockResponse as any).locals = { user: { userId } };

    // Mock the userService.logout method to throw an error
    const expectedError = new InvalidAccessError("Invalid Access");
    jest.spyOn(userService, "logout").mockRejectedValue(expectedError);

    await userController.logout(mockRequest, mockResponse, next);

    // logout 메소드는 몇번 호출되었는지
    expect(userService.logout).toHaveBeenCalledTimes(1);

    // logout status의 반환값은 무엇인가.
    expect(mockResponse.status).toHaveBeenCalledWith(400);

    // logout json 반환값은 무엇인가.
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: expectedError.message,
    });
  });

});
