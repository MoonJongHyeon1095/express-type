import UserService from "../services/user.service";
import { Request, Response, NextFunction } from "express";
import { InvalidParamsError } from "../utils/exceptions";
import { Inject, Service } from "typedi";

export default class UserController {
  @Inject()
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, pw } = req.body;
      if (!id || !pw)
        throw new InvalidParamsError("아이디나 비밀번호를 입력해주십시오");

      const data = await this.userService.login(id, pw);
      res.cookie("accesstoken", `Bearer ${data.accesstoken}`)
      res.cookie("refreshtoken", `Bearer ${data.refreshtoken}`);
      res.status(200).json({
        message: "success",
        data: data
      });
    } catch (error: any) {
      console.log(error);
      res.status(error.status || 400).json({ message: error.message });
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(res.locals.user.userId)
      await this.userService.logout(userId)

      res.status(200).json({
        message: "success"
      })
    } catch (error: any) {
      res.status(error.status || 400).json({ message: error.message });
    }
  }
}
