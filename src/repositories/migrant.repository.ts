import pool from "../db/connection";
import { Service } from "typedi";
import { Migrant } from "../entity/migrant.entity";
import { Address } from "../entity/address.entity";
import { Image } from "../entity/image.entity";

@Service()
export default class MigrantRepository {
  createMigrant = async (migrantData: MigrantDTO) => {
    const query = `
    INSERT INTO migrant (name, enssn, phone, createdAt) values (?)`;

    return await this.runQuery(
      query,
      migrantData.name,
      migrantData.enssn,
      migrantData.phone,
      migrantData.createdAt
    );
  };

  createAddress = async (migrantId: number, addressData: AddressDTO) => {
    const query = `
    INSERT INTO address (migrantId, address1, address2, createdAt) values (?)`;
    return await this.runQuery(
      query,
      migrantId,
      addressData.address1,
      addressData.address2,
      addressData.createdAt
    );
  };

  createImage = async (migrantId: number, imageData: ImageDTO) => {
    const query = `
    INSERT INTO image (migrantId, imageUrl, imageTxt, createdAt) values (?)`;
    return await this.runQuery(
      query,
      migrantId,
      imageData.imageUrl,
      imageData.imageTxt
    );
  };

  findMigrant = async (migrantId: number) => {
    const query = `
    SELECT m.migrantId, m.name, m.enssn, m.phone,
    JSON_ARRAYAGG(JSON_OBJECT('address1', a.address1, 'address2', a.address2, 'createdAt', a.createdAt)) AS addresses,
    JSON_ARRAYAGG(JSON_OBJECT('imageUrl', i.imageUrl, 'imageSize', i.imageSize, 'imageTxt', i.imageTxt, 'createdAt', i.createdAt)) AS images,
    m.createdAt
    FROM migrant m
    LEFT JOIN address a ON m.migrantId = a.migrantId
    LEFT JOIN image i ON m.migrantId = i.migrantId
    WHERE m.migrantId = ?
    GROUP BY m.migrantId, m.name, mp.enssn, m.phone, i.imageUrl, m.createdAt;`;
  
    return await this.runQuery(
        query,
        migrantId
    )
};

  /**
   * 반복되는 트랜잭션 함수화
   * @param query
   * @param param
   * @returns
   */
  async runQuery(query: string, ...param: any) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const resultPacket = await connection.query(query, [param]);
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
