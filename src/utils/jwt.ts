import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { Service, Container } from "typedi";
dotenv.config()
const secretKey = process.env.JWT_KEY || 'default-secret-key';

@Service()
export class JWT {
  access= (payload: {}) => {
    return jwt.sign(payload, secretKey, {
      algorithm: "HS256",
      expiresIn: 60 * 60 * 2,
    });
  }

  refresh = () => {
    return jwt.sign({}, secretKey, {
      algorithm: "HS256",
      expiresIn: 60 * 60 * 24,
    });
  }

  verify = (token: string) => {
    try {
      const result = jwt.verify(token, secretKey);
      return result;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return null;
      }
    }
  }
}
