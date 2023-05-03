import pool from "../db/connection";
import { Service } from "typedi";
import { Patient } from "../entity/patient.entity";
import { PatientAddress } from "../entity/patient_address.entity";
import { PatientImage } from "../entity/patient_image.entity";

@Service()
export default class PatientRepository {
  createPatient = async (patientData: PatientDTO) => {
    const query = `
    INSERT INTO patient (name, ssn, enssn, birthDate, cellPhone, phone, email, createdAt) values (?)`;

    return await this.runQuery(
      query,
      patientData.name,
      patientData.ssn,
      patientData.enssn,
      patientData.birthDate,
      patientData.cellPhone,
      patientData.phone,
      patientData.email,
      patientData.createdAt
    );
  };

  createAddress = async (patientId: number, addressData: AddressDTO) => {
    const query = `
    INSERT INTO patient_address (patientId, address1, address2, createdAt) values (?)`;
    return await this.runQuery(
      query,
      patientId,
      addressData.address1,
      addressData.address2,
      addressData.createdAt
    );
  };

  createImage = async (patientId: number, imageData: ImageDTO) => {
    const query = `
    INSERT INTO patient_image (imageId, patientId, imageUrl, imageSize, imageTxt, createdAt) values (?)`;
    return await this.runQuery(
      query,
      patientId,
      imageData.imageUrl,
      imageData.imageSize,
      imageData.imageTxt
    );
  };

  findPatient = async (patientId: number) => {
    const query = `
    SELECT p.patientId, p.name, p.ssn, p.enssn, p.birthDate, p.cellPhone, p.phone,
    JSON_ARRAYAGG(JSON_OBJECT('address1', a.address1, 'address2', a.address2, 'createdAt', a.createdAt)) AS addresses,
    JSON_ARRAYAGG(JSON_OBJECT('imageUrl', i.imageUrl, 'imageSize', i.imageSize, 'imageTxt', i.imageTxt, 'createdAt', i.createdAt)) AS images,
    p.createdAt
    FROM patient p
    LEFT JOIN patient_address a ON p.patientId = a.patientId
    LEFT JOIN patient_image i ON p.patientId = i.patientId
    WHERE p.patientId = ?
    GROUP BY p.patientId, p.name, p.ssn, p.enssn, p.birthDate, p.cellPhone, p.phone, i.imageUrl, p.createdAt;`;
  
    return await this.runQuery(
        query,
        patientId
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
