import pool from "../db/connection";
import { Service } from "typedi";

@Service()
export default class UserRepository {
  /**
   * 로그인 요청시 id로 조회
   * @param id
   * @returns
   */
  findUserById = async (id: string) => {
    const query = `SELECT * FROM user WHERE nickname = ?`;
    return await this.runQuery(query, id);
  };
  findUserByToken = async (token: string) => {
    const query = `SELECT * FROM user WHERE refreshtoken = ?`;
    return await this.runQuery(query, token);
  };

  updateRefreshToken = async (refreshToken: string, userId: number) => {
    const query = `UPDATE user SET refreshToken = (?) WHERE userId = (?)`;
    return await this.runQuery(query, refreshToken, userId);
  };

  deleteRefreshToken = async (userId: number) => {
    const query = `UPDATE user SET refreshtoken = NULL WHERE userId = ?`;
    return await this.runQuery(query, userId);
  };

  /**
   * 반복되는 트랜잭션의 함수화
   * @param query
   * @param param
   * @returns
   */
  async runQuery(query: string, ...param: any) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const resultPacket = await connection.query(query, param);
      const result = JSON.parse(JSON.stringify(resultPacket))[0][0];

      await connection.commit();
      connection.release();
      return result;
    } catch (error) {
      await connection.rollback(); //롤백
      connection.release();
      console.log(error);
      throw error;
    }
  }
}

// export default new UserRepository()
