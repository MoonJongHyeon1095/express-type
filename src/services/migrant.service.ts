import { InvalidAccessError } from "../utils/exceptions";
import JWT from "../utils/jwt";
import { Service, Inject, Container } from "typedi";
import MigrantRepository from "../repositories/migrant.repository";
import * as bcrypt from "bcrypt";
import migrantRepositoryContainer from "../container/migrant.repository.container";

@Service()
export default class MigrantService {
  private migrantRepository: MigrantRepository;
  constructor() {
    this.migrantRepository = migrantRepositoryContainer.get('migrantRepository');
  }

  createMigrant = async (
    migrantDto: MigrantDTO,
    addressDto: AddressDTO,
    imageDto: ImageDTO
  ) => {
    const createdAt = this.getTime();
    const salt = await bcrypt.genSalt();
    const enssn = await bcrypt.hash(migrantDto.ssn, salt);

    const migrantData = {
      name: migrantDto.name.toString(),
      ssn: migrantDto.ssn.toString().slice(0, 7),
      enssn: enssn,
      phone: migrantDto.phone.toString(),
      createdAt: createdAt,
    };

    const addressData = {
      address1: addressDto.address1.toString(),
      address2: addressDto.address2.toString(),
      createdAt: createdAt,
    };

    const imageData = {
      imageUrl: imageDto.imageUrl.toString(),
      imageTxt: imageDto.imageTxt.toString(),
      createdAt: createdAt,
    };

    const migrant = await this.migrantRepository.createMigrant(migrantData);
    const migrantId = migrant.migrantId;

    const results = await Promise.allSettled([
      this.migrantRepository.createAddress(migrantId, addressData),
      this.migrantRepository.createImage(migrantId, imageData),
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

  findMigrant = async(migrantId: number) => {
    return await this.migrantRepository.findMigrant(migrantId)
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
