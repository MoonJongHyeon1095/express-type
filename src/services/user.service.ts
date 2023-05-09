import UserRepository from "../repositories/user.repository";
import { InvalidAccessError } from "../utils/exceptions";
import JWT from "../utils/jwt";
import { Service, Inject, Container } from "typedi";
import userRepositoryContainer from "../container/user.repository.container";
import jwtContainer from "../container/jwt.container";

@Service()
export default class UserService {
  // @Inject()
  private userRepository: UserRepository
  // @Inject()
  private jwt: JWT

  constructor(){
    this.userRepository = userRepositoryContainer.get('userRepository')
    this.jwt = jwtContainer.get('jwt')
  }
  login = async (id: string, pw: string) => {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new InvalidAccessError("아이디가 존재하지 않습니다.", 401);
    if (pw !== user.password) throw new InvalidAccessError("비밀번호가 일치하지 않습니다.", 401);

    const accessToken = this.jwt.access(user);
    const refreshToken = this.jwt.refresh();

    await this.userRepository.updateRefreshToken(refreshToken, user.userId)
    return {
      accesstoken: accessToken,
      accesstokenExp: "2시간",
      refreshtoken: refreshToken,
      refreshtokenExp: "1일",
    };
  }

  logout = async (userId : number) => {
    return await this.userRepository.deleteRefreshToken(userId)
  }
}

// export default new UserService()
