import JWT from "../utils/jwt";
import { Request, Response, NextFunction } from "express";
import { InvalidAccessError } from "../utils/exceptions";
import { Inject, Service } from "typedi";
import UserRepository from "../repositories/user.repository";
import dotenv from "dotenv";
import jwtContainer from "../container/jwt.container";
import userRepositoryContainer from "../container/user.repository.container";
dotenv.config();

@Service()
export class AuthMiddleware {
  // @Inject()
  private userRepository: UserRepository;
  // @Inject()
  private jwt: JWT;
  // constructor(
  //   @Inject()
  //   userRepository: UserRepository,
  //   @Inject() jwt: JWT
  // ) {
  //   this.userRepository = userRepository;
  //   this.jwt = jwt;
  // }
  constructor(){
    this.jwt = jwtContainer.get('jwt')
    this.userRepository = userRepositoryContainer.get('userRepository')
  }
  authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    // const { authorization, refreshtoken } = req.headers;
    // const [accType, accessToken] = (authorization || "").split(" ");
    // const [refType, refreshToken] = (refreshtoken?.toString() || "").split(" ");

    // if (accType !== "Bearer" || refType !== "Bearer") {
    //   //res.status(401).send({errorMessage: '로그인 후 사용하세요.'});
    //   return next(
    //     new InvalidAccessError("로그인 후 이용 가능한 기능입니다.", 401)
    //   );
    // }

    try {
      /**
       * acessToken 검증
       */
      const { accesstoken, refreshtoken } = req.cookies;
      if (!accesstoken || !refreshtoken) {
        return next(
          new InvalidAccessError("로그인 후 이용 가능한 기능입니다.", 401)
        );
      }

      const [accType, accessToken] = (accesstoken || "").split(" ");
      const [refType, refreshToken] = (refreshtoken || "").split(
        " "
      );
      if (accType !== "Bearer" || refType !== "Bearer") {
        return next(new InvalidAccessError("다시 로그인해주십시오.", 401));
      }

      const accessPayload = this.jwt.verify(accessToken);
      if (accessPayload) {
        res.locals.user = accessPayload;
        return next();
      }
      /**
       * AccessToken만 만료시 AccessToken재발급
       */
      if (!accessPayload) {
        const refreshPayload = this.jwt.verify(refreshToken);

        /**
         * refreshToken 만료시 재로그인 요청
         */
        if (!refreshPayload) {
          return next(new InvalidAccessError("다시 로그인 해주십시오.", 401));
        }

        if (refreshPayload) {
          const user = await this.userRepository.findUserByToken(refreshToken);

          /**
           * refreshToken은 정상이지만 한번도 로그인을 한 적이 없는 에외적인 경우
           * 즉, refreshToken이 중간에 탈취된 경우
           */
          if (!user) {
            return next(
              new InvalidAccessError("로그인 시간이 만료되었습니다.", 401)
            );
          }

          /**
           * AccessToken 재발급
           * */
          const newAccessToken = this.jwt.access(user);

          res.locals.user = user;
          res.cookie("accesstoken", `Bearer ${newAccessToken}`);
          // res.json({
          //   message: "accesstoken 재발급",
          //   accessToken: `Bearer ${newAccessToken}`,
          // });
          next();
        }
      }
    } catch (error) {
      next(error);
    }
  }
}
