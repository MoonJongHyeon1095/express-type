import multer, { FileFilterCallback } from "multer";
import path from 'path';
import dotenv from "dotenv";
dotenv.config();
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
  destination: function (
    req: Express.Request,
    file: Express.Multer.File,
    callback: DestinationCallback
  ) {
    const destinationPath = path.join(process.cwd(), 'src', 'images');
    callback(null, destinationPath);
  },
  filename: function (
    req: Express.Request,
    file: Express.Multer.File,
    callback: FileNameCallback
  ) {
    const now = new Date();
    callback(null, `${getTime().toString()}` + file.originalname);
  },
});
const imageFilter = function (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(null, false);
  }
  cb(null, true);
};

export const upload = multer({ storage: storage, fileFilter: imageFilter });

import * as cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "doi9y5hig",
  api_key: "854222453699843",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
   * @returns 생성일자
   */
 function getTime(){
  const now = new Date();
  const yyyy = now.getFullYear().toString();
  const MM = (now.getMonth() + 1).toString().padStart(2, "0");
  const dd = now.getDate().toString().padStart(2, "0");
  const HH = now.getHours().toString().padStart(2, "0");
  const mm = now.getMinutes().toString().padStart(2, "0");
  const ss = now.getSeconds().toString().padStart(2, "0");
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
};