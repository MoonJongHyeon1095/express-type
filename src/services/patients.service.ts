import { InvalidAccessError } from "../utils/exceptions";
import { JWT } from "../utils/jwt";
import { Service, Inject, Container } from "typedi";
import PatientRepository from "../repositories/patients.repository";
import * as bcrypt from "bcrypt";

@Service()
export default class PatientService {
  @Inject()
  private patientRepository: PatientRepository;
  constructor(patientRepository: PatientRepository) {
    this.patientRepository = patientRepository;
  }

  createPatient = async (
    patientDto: PatientDTO,
    addressDto: AddressDTO,
    imageDto: ImageDTO
  ) => {
    const createdAt = this.getTime();
    const salt = await bcrypt.genSalt();
    const enssn = await bcrypt.hash(patientDto.ssn, salt);

    const patientData = {
      name: patientDto.name.toString(),
      ssn: patientDto.ssn.toString().slice(0, 7),
      enssn: enssn,
      birthDate: patientDto.birthDate.toString(),
      cellPhone: patientDto.cellPhone.toString(),
      phone: patientDto.phone.toString(),
      email: patientDto.email.toString(),
      createdAt: createdAt,
    };

    const addressData = {
      address1: addressDto.address1.toString(),
      address2: addressDto.address2.toString(),
      createdAt: createdAt,
    };

    const imageData = {
      imageUrl: imageDto.imageUrl.toString(),
      imageSize: Number(imageDto.imageSize),
      imageTxt: imageDto.imageTxt.toString(),
      createdAt: createdAt,
    };

    const patient = await this.patientRepository.createPatient(patientData);
    const patientId = patient.patientid;

    const results = await Promise.allSettled([
      this.patientRepository.createAddress(patientId, addressData),
      this.patientRepository.createImage(patientId, imageData),
    ]);

    const successful = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => (result as PromiseFulfilledResult<any>).value);

    const failed = results
      .filter((result) => result.status === "rejected")
      .map((result) => (result as PromiseRejectedResult).reason);

    console.log("Successful: ", successful);
    console.log("Failed: ", failed);
  };

  findPatient = async(patientId: number) => {
    return await this.patientRepository.findPatient(patientId)
  }

  /**
   * @returns 생성일자
   */
  getTime = () => {
    const now = new Date();
    const yyyy = now.getFullYear().toString();
    const MM = (now.getMonth() + 1).toString().padStart(2, "0");
    const dd = now.getDate().toString().padStart(2, "0");
    const HH = now.getHours().toString().padStart(2, "0");
    const mm = now.getMinutes().toString().padStart(2, "0");
    const ss = now.getSeconds().toString().padStart(2, "0");
    return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
  };
}
