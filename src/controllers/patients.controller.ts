import { Request, Response, NextFunction } from "express";
import { InvalidParamsError } from "../utils/exceptions";
import { Inject, Service } from "typedi";
import PatientService from "../services/patients.service";

export default class PatientController {
  @Inject()
  private patientService: PatientService;
  constructor(patientService: PatientService) {
    this.patientService = patientService;
  }

  createPatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { addresses, images, ...patientData } = req.body;

      const patientDto: PatientDTO = {
        ...patientData,
      };

      const addressDto: AddressDTO = {
        ...addresses,
      };

      const imageDto: ImageDTO = {
        ...images,
      };

      const imageData = await this.getImageData(req, next);
      const data = await this.patientService.createPatient(
        patientDto,
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

  getImageData = async (req: Express.Request, next: NextFunction) => {
    try {
      console.log(req.file);
      const imageSize = req.file?.size
      const imageTxt = req.file?.mimetype.split('/')
      const image
      const imageData = {
        imageSize : req.file.size,

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

  findPatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = Number(req.params.patientId);
      if (!patientId)
        throw new InvalidParamsError("환자아이디를 입력해주세요", 400);

      const data = await this.patientService.findPatient(patientId);
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
