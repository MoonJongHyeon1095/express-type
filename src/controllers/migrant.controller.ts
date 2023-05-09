import { Request, Response, NextFunction } from "express";
import { InvalidParamsError } from "../utils/exceptions";
import { Inject, Service } from "typedi";
import MigrantService from "../services/migrant.service";
import migrantServiceContainer from "../container/migrant.service.container";

export default class MigrantController {

  private migrantService: MigrantService;
  constructor() {
    this.migrantService = migrantServiceContainer.get('migrantService');
  }

  createMigrant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { addresses, ...migrantData } = req.body;
      const {imageUrl, imageTxt} = req.body
      const migrantDto: MigrantDTO = {
        ...migrantData,
      };

      const addressDto: AddressDTO = {
        ...addresses,
      };

      const imageDto: ImageDTO = {
        imageUrl,
        imageTxt
      };

      
      const data = await this.migrantService.createMigrant(
        migrantDto,
        addressDto,
        imageDto
      );
      res.status(200).json({
        message: "success",
        data: data,
      });
    } catch (error: any) {
      console.log(error);
      res.status(error.status || 400).json({ message: error.message });
    }
  };

  async getImageData (req: Express.Request , next: NextFunction){
    try {
      console.log('req.file:', req.file);
      console.log('req.files:',req.files);


      const imageData = {
 
    };
      if (!imageData) {
        throw new InvalidParamsError(
          "이미지가 req.file.location 안에 없습니다. 멀터가 안넣어준듯?"
        );
      }

      return imageData;
    } catch (error) {
      next(error);
    }
  };

  findMigrant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const migrantId = Number(req.params.migrantId);
      if (!migrantId)
        throw new InvalidParamsError("환자아이디를 입력해주세요", 400);

      const data = await this.migrantService.findMigrant(migrantId);
      if (!data) throw new Error("환자 데이터가 없습니다.");

      res.status(200).json({
        message: "success",
        data: data,
      });
    } catch (error: any) {
      console.log(error);
      res.status(error.status || 400).json({ message: error.message });
    }
  };
}
